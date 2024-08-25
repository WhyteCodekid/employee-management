import { TableCell, TableRow } from "@nextui-org/react";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import SearchAndCreateRecordBar from "~/components/sections/search-create-bar";
import Header from "~/components/ui/header";
import CustomTable from "~/components/ui/new-table";
import AttendanceController from "~/controllers/AttendanceController";
import DepartmentController from "~/controllers/DepartmentController";

export default function AdminAttendanceManagement() {
  const flashMessage = useOutletContext<{
    message: string;
    status: "error" | "success";
  }>();
  const { search_term, page, departments, attendance } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();
  console.log(departments);

  return (
    <div className="flex flex-col">
      <Header title="View Employee Attendance" />

      <SearchAndCreateRecordBar
        buttonText="Open Face Scanner"
        modalTitle="Confirm Open Facial Recognition"
        searchValue={search_term}
        pageValue={page}
        formIntent="open-scanner"
        flashMessage={flashMessage}
      >
        <div className="flex flex-col gap-5">
          <p className="font-quicksand">
            Are you sure to open the facial recognition scanner? <br /> This
            will take you out of your dashboard!
          </p>
        </div>
      </SearchAndCreateRecordBar>

      <div className="px-4">
        <CustomTable
          columns={[
            "Staff ID",
            "Staff Name",
            "Date",
            "Time In",
            "Time Out",
            "Status",
          ]}
          page={page}
          setPage={(page) =>
            navigate(`?page=${page}&search_term=${search_term}`)
          }
          totalPages={1}
        >
          {attendance?.map(
            (
              department: { name: string; description: string },
              index: number
            ) => (
              <TableRow key={index}>
                <TableCell>{department.name}</TableCell>
                <TableCell>{department.description}</TableCell>
                <TableCell>{department.description}</TableCell>
                <TableCell>{department.description}</TableCell>
                <TableCell>{department.description}</TableCell>
                <TableCell>{department.description}</TableCell>
              </TableRow>
            )
          )}
        </CustomTable>
      </div>
    </div>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData.entries());

  if (formValues.intent === "open-scanner") {
    return redirect("/scanner");
  }

  return null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const search_term = url.searchParams.get("search_term") || "";
  const page = parseInt(url.searchParams.get("page") || "1");

  const departmentController = await new DepartmentController(request);
  const { departments, totalPages } = await departmentController.getDepartments(
    {
      page,
      search_term,
    }
  );

  const attendanceController = await new AttendanceController(request);
  const { attendance } = await attendanceController.todayAttendance({
    page,
    search_term,
  });

  return {
    search_term,
    page,
    departments,
    totalPages,
    attendance,
  };
};

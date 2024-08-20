import { Button, TableCell, TableRow } from "@nextui-org/react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import TextInput from "~/components/inputs/text-input";
import TextareaInput from "~/components/inputs/textarea";
import SearchAndCreateRecordBar from "~/components/sections/search-create-bar";
import Header from "~/components/ui/header";
import CustomTable from "~/components/ui/new-table";
import DepartmentController from "~/controllers/DepartmentController";

export default function AdminDepartmentsManagement() {
  const flashMessage = useOutletContext<{
    message: string;
    status: "error" | "success";
  }>();
  const { search_term, page, departments } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  console.log(departments);

  return (
    <div>
      <Header title="Manage Departments" />

      <SearchAndCreateRecordBar
        buttonText="New Department"
        modalTitle="Create New Department"
        searchValue={search_term}
        pageValue={page}
        formIntent="create-department"
        flashMessage={flashMessage}
      >
        <div className="flex flex-col gap-5">
          <TextInput label="Name" name="name" />
          <TextareaInput label="Description" name="description" />
        </div>
      </SearchAndCreateRecordBar>

      <CustomTable
        columns={["Name", "Description", "Actions"]}
        page={page}
        setPage={(page) => navigate(`?page=${page}&search_term=${search_term}`)}
        totalPages={1}
      >
        {departments?.map(
          (
            department: { name: string; description: string },
            index: number
          ) => (
            <TableRow key={index}>
              <TableCell>{department.name}</TableCell>
              <TableCell>{department.description}</TableCell>
              <TableCell className="flex items-center gap-3">
                <Button>Edit</Button>
                <Button>Delete</Button>
              </TableCell>
            </TableRow>
          )
        )}
      </CustomTable>
    </div>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData.entries());
  const departmentController = await new DepartmentController(request);

  if (formValues.intent === "create-department") {
    return await departmentController.createDepartment(formValues);
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

  return {
    search_term,
    page,
    departments,
    totalPages,
  };
};

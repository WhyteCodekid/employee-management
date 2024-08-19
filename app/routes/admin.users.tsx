import { Button, TableCell, TableRow } from "@nextui-org/react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { ImageInputWithPreview } from "~/components/inputs/image";
import TextInput from "~/components/inputs/text-input";
import TextareaInput from "~/components/inputs/textarea";
import SearchAndCreateRecordBar from "~/components/sections/search-create-bar";
import Header from "~/components/ui/header";
import CustomTable from "~/components/ui/new-table";
import DepartmentController from "~/controllers/DepartmentController";

export default function AdminEmployeesManagement() {
  const { search_term, page, employees } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  // state to handle base64 image
  const [imageString, setImageString] = useState("");

  return (
    <div>
      <Header title="Manage Employees" />

      <SearchAndCreateRecordBar
        buttonText="New Employee"
        modalTitle="Create New Employee"
        searchValue={search_term}
        pageValue={page}
        formIntent="create-employee"
      >
        <div className="flex flex-col gap-5">
          <TextInput label="First Name" name="firstName" isRequired />
          <TextInput label="Last Name" name="lastName" isRequired />
          <TextInput label="Email" name="email" type="email" isRequired />
          <TextInput label="Phone" name="phone" type="tel" isRequired />
          <TextInput
            label="Base Salary"
            name="baseSalary"
            type="number"
            isRequired
          />
          <ImageInputWithPreview
            name="image"
            imageString={imageString}
            setImageString={setImageString}
            label="Passport Picture"
          />
        </div>
      </SearchAndCreateRecordBar>

      <div className="px-4">
        <CustomTable
          columns={["Name", "Description", "Actions"]}
          page={page}
          setPage={(page) =>
            navigate(`?page=${page}&search_term=${search_term}`)
          }
          totalPages={1}
        >
          {/* {employees?.map(
          (employee: { name: string; description: string }, index: number) => (
            <TableRow key={index}>
              <TableCell>{employee.name}</TableCell>
              <TableCell>{employee.description}</TableCell>
              <TableCell className="flex items-center gap-3">
                <Button>Edit</Button>
                <Button>Delete</Button>
              </TableCell>
            </TableRow>
          )
        )} */}
        </CustomTable>
      </div>
    </div>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData.entries());

  if (formValues.intent === "create-employee") {
    console.log(formValues);
    return formValues;
  }

  return null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const search_term = url.searchParams.get("search_term") || "";
  const page = parseInt(url.searchParams.get("page") || "1");

  const departmentController = await new DepartmentController(request);
  const employees =
    departmentController.getDepartments({
      page,
      search_term,
    }) || [];

  return {
    search_term,
    page,
    employees,
  };
};

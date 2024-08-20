import {
  Button,
  Chip,
  SelectItem,
  TableCell,
  TableRow,
} from "@nextui-org/react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { ImageInputWithPreview } from "~/components/inputs/image";
import CustomSelect from "~/components/inputs/select";
import TextInput from "~/components/inputs/text-input";
import SearchAndCreateRecordBar from "~/components/sections/search-create-bar";
import Header from "~/components/ui/header";
import CustomTable from "~/components/ui/new-table";
import DepartmentController from "~/controllers/DepartmentController";
import UserController from "~/controllers/UserController";
import { UserInterface } from "~/utils/types";

export default function AdminEmployeesManagement() {
  const { search_term, page, employees } = useLoaderData<typeof loader>();
  console.log(employees);

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
          <CustomSelect name="role" label="Employee Role">
            <SelectItem className="font-quicksand" key={"admin"}>
              Administrator
            </SelectItem>
            <SelectItem className="font-quicksand" key={"staff"}>
              Staff
            </SelectItem>
          </CustomSelect>
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
          columns={[
            "Staff ID",
            "Full Name",
            "Email",
            "Phone",
            "Role",
            "Actions",
          ]}
          page={page}
          setPage={(page) =>
            navigate(`?page=${page}&search_term=${search_term}`)
          }
          totalPages={employees?.totalPages}
        >
          {employees?.users?.map((employee: UserInterface, index: number) => (
            <TableRow key={index}>
              <TableCell>{`AEMS${employee.staffId}`}</TableCell>
              <TableCell>{`${employee.firstName} ${employee.lastName}`}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.phone}</TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  variant="flat"
                  classNames={{ content: "capitalize" }}
                  color={employee.role === "admin" ? "success" : "warning"}
                >
                  {employee.role}
                </Chip>
              </TableCell>
              <TableCell className="flex items-center gap-2">
                <Button variant="flat" color="primary" size="sm">
                  Edit
                </Button>
                <Button variant="flat" color="danger" size="sm">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </CustomTable>
      </div>
    </div>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData.entries());

  const userController = new UserController(request);
  if (formValues.intent === "create-employee") {
    await userController.createUser(formValues);
    return {};
  }

  return null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const search_term = url.searchParams.get("search_term") || "";
  const page = parseInt(url.searchParams.get("page") || "1");

  const userController = new UserController(request);
  const employees = await userController.getUsers({
    page,
    search_term,
  });

  return {
    search_term,
    page,
    employees,
  };
};

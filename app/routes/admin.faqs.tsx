/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Chip,
  SelectItem,
  TableCell,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { useEffect, useState } from "react";
import { ImageInputWithPreview } from "~/components/inputs/image";
import CustomSelect from "~/components/inputs/select";
import TextInput from "~/components/inputs/text-input";
import DeleteRecordModal from "~/components/modals/DeleteRecord";
import EditRecordModal from "~/components/modals/EditRecord";
import SearchAndCreateRecordBar from "~/components/sections/search-create-bar";
import Header from "~/components/ui/header";
import CustomTable from "~/components/ui/new-table";
import UserController from "~/controllers/UserController";
import { UserInterface } from "~/utils/types";
import * as faceapi from "face-api.js";
import TextareaInput from "~/components/inputs/textarea";

export default function AdminEmployeesManagement() {
  const flashMessage = useOutletContext<{
    message: string;
    status: "error" | "success";
  }>();
  const { search_term, page, users, totalPages } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();

  // delete user stuff
  const deleteDisclosure = useDisclosure();
  const [userId, setUserId] = useState("");

  // edit user stuff
  const editDisclosure = useDisclosure();
  const [userData, setUserData] = useState<UserInterface | null>(null);
  useEffect(() => {
    if (!editDisclosure.isOpen) {
      setUserData(null);
    }
  }, [editDisclosure.onOpenChange]);

  useEffect(() => {
    if (flashMessage && flashMessage.status === "success") {
      setUserId("");
      deleteDisclosure.onClose();
    }
  }, [flashMessage]);

  return (
    <div>
      <Header title="Manage Frequently Asked Questions" />

      <SearchAndCreateRecordBar
        buttonText="New FAQ"
        modalTitle="Add New Frequently Asked Question"
        searchValue={search_term}
        pageValue={page}
        formIntent="create-faq"
        flashMessage={flashMessage}
      >
        <div className="flex flex-col gap-5">
          <TextInput label="Question" name="question" isRequired />
          <TextareaInput label="Answer" name="answer" isRequired />
        </div>
      </SearchAndCreateRecordBar>

      <div className="px-4">
        <CustomTable
          columns={["Question", "Answer", "Actions"]}
          page={page}
          setPage={(page) =>
            navigate(`?page=${page}&search_term=${search_term}`)
          }
          totalPages={totalPages}
        >
          {users?.map((employee: UserInterface, index: number) => (
            <TableRow key={index}>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.phone}</TableCell>
              <TableCell className="flex items-center gap-2">
                <Button
                  variant="flat"
                  color="primary"
                  size="sm"
                  onPress={() => {
                    setUserData(employee);
                    editDisclosure.onOpen();
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="flat"
                  color="danger"
                  size="sm"
                  onPress={() => {
                    setUserId(employee._id);
                    deleteDisclosure.onOpen();
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </CustomTable>
      </div>

      {/* edit user modal */}
      <EditRecordModal
        isModalOpen={editDisclosure.isOpen}
        onCloseModal={editDisclosure.onClose}
        title="Update User Account"
        intent="update-user"
        size="lg"
      >
        <div className="flex flex-col gap-5">
          <TextInput
            label="User ID"
            name="id"
            value={userData?._id}
            className="hidden"
          />
          <TextInput
            label="First Name"
            name="firstName"
            value={userData?.firstName}
          />
          <TextInput
            label="Last Name"
            name="lastName"
            value={userData?.lastName}
          />
          <TextInput
            label="Email"
            name="email"
            type="email"
            value={userData?.email}
          />
          <TextInput
            label="Phone"
            name="phone"
            type="tel"
            value={userData?.phone}
          />
          <CustomSelect
            selectedKeys={[userData?.role as string]}
            name="role"
            label="Employee Role"
          >
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
        </div>
      </EditRecordModal>

      {/* delete user modal */}
      <DeleteRecordModal
        isModalOpen={deleteDisclosure.isOpen}
        onCloseModal={deleteDisclosure.onClose}
        title="Delete Employee Account"
      >
        <p className="font-quicksand">
          Are you sure to delete this employee? This action cannot be undone...
        </p>
        <TextInput name="id" value={userId} className="hidden" />
      </DeleteRecordModal>
    </div>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData.entries());

  const userController = new UserController(request);
  if (formValues.intent === "create-employee") {
    return userController.createUser(formValues);
  }
  if (formValues.intent === "delete") {
    return userController.deleteUser({ userId: formValues.id });
  }

  return null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const search_term = url.searchParams.get("search_term") || "";
  const page = parseInt(url.searchParams.get("page") || "1");

  const userController = new UserController(request);
  const { users, totalPages } = await userController.getUsers({
    page,
    search_term,
    limit: 15,
  });

  return {
    search_term,
    page,
    users,
    totalPages,
  };
};

import { Button, TableCell, TableRow, useDisclosure } from "@nextui-org/react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { useEffect, useState } from "react";
import TextInput from "~/components/inputs/text-input";
import TextareaInput from "~/components/inputs/textarea";
import DeleteRecordModal from "~/components/modals/DeleteRecord";
import EditRecordModal from "~/components/modals/EditRecord";
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

  // delete user stuff
  const deleteDisclosure = useDisclosure();
  const [deptId, setDeptId] = useState("");

  // edit user stuff
  const editDisclosure = useDisclosure();
  const [dept, setDept] = useState<any>(null);

  useEffect(() => {
    if (!editDisclosure.isOpen) {
      setDept(null);
    }
  }, [editDisclosure.onOpenChange]);

  useEffect(() => {
    if (flashMessage && flashMessage.status === "success") {
      setDeptId("");
      deleteDisclosure.onClose();
      editDisclosure.onClose();
    }
  }, [flashMessage]);

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

      <div className="px-4">
        <CustomTable
          columns={["Name", "Description", "Actions"]}
          page={page}
          setPage={(page) =>
            navigate(`?page=${page}&search_term=${search_term}`)
          }
          totalPages={1}
        >
          {departments?.map(
            (
              department: { name: string; description: string; _id: string },
              index: number
            ) => (
              <TableRow key={index}>
                <TableCell>{department.name}</TableCell>
                <TableCell>{department.description}</TableCell>
                <TableCell className="flex items-center gap-3">
                  <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    onPress={() => {
                      setDept(department);
                      editDisclosure.onOpen();
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    variant="flat"
                    onPress={() => {
                      setDeptId(department._id);
                      deleteDisclosure.onOpen();
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            )
          )}
        </CustomTable>
      </div>

      {/* edit user modal */}
      <EditRecordModal
        isModalOpen={editDisclosure.isOpen}
        onCloseModal={editDisclosure.onClose}
        title="Update Department"
        intent="update-department"
        size="lg"
      >
        <div className="flex flex-col gap-5">
          <TextInput
            label="Department ID"
            name="id"
            value={dept?._id}
            className="hidden"
          />
          <TextInput
            label="Name"
            name="name"
            value={dept?.name}
            onValueChange={(value) =>
              setDept((prev: any) => ({
                ...prev,
                name: value as string,
              }))
            }
          />
          <TextareaInput
            label="Description"
            name="description"
            value={dept?.description}
            onValueChange={(value) =>
              setDept((prev: any) => ({
                ...prev,
                description: value as string,
              }))
            }
          />
        </div>
      </EditRecordModal>

      {/* delete user modal */}
      <DeleteRecordModal
        isModalOpen={deleteDisclosure.isOpen}
        onCloseModal={deleteDisclosure.onClose}
        title="Delete Department"
      >
        <p className="font-quicksand">
          Are you sure to delete this department? This action cannot be
          undone...
        </p>
        <TextInput name="id" value={deptId} className="hidden" />
      </DeleteRecordModal>
    </div>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData.entries());
  const departmentController = new DepartmentController(request);

  if (formValues.intent === "create-department") {
    return await departmentController.createDepartment({
      name: formValues.name as string,
      description: formValues.description as string,
    });
  }

  if (formValues.intent === "update-department") {
    return await departmentController.updateDepartment({
      _id: formValues.id as string,
      name: formValues.name as string,
      description: formValues.description as string,
    });
  }

  if (formValues.intent === "delete") {
    return departmentController.deleteDepartment({
      _id: formValues.id as string,
    });
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

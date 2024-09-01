import {
  Button,
  SelectItem,
  TableCell,
  TableRow,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { useEffect, useState } from "react";
import TextInput from "~/components/inputs/text-input";
import DeleteRecordModal from "~/components/modals/DeleteRecord";
import EditRecordModal from "~/components/modals/EditRecord";
import SearchAndCreateRecordBar from "~/components/sections/search-create-bar";
import Header from "~/components/ui/header";
import CustomTable from "~/components/ui/new-table";
import TextareaInput from "~/components/inputs/textarea";
import FaqController from "~/controllers/FaqController";
import PayrollController from "~/controllers/PayrollController";
import CustomSelect from "~/components/inputs/select";
import moment from "moment";
import JobController from "~/controllers/JobController";

export default function AvaibleJobs() {
  const flashMessage = useOutletContext<{
    message: string;
    status: "error" | "success";
  }>();
  const { search_term, page, jobs, totalPages } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { user } = useOutletContext();

  // delete user stuff
  const deleteDisclosure = useDisclosure();
  const [deleteId, setDeleteId] = useState("");

  // edit user stuff
  const editDisclosure = useDisclosure();
  const [data, setData] = useState<any | null>(null);
  useEffect(() => {
    if (!editDisclosure.isOpen) {
      setData(null);
    }
  }, [editDisclosure.onOpenChange]);

  const [commitment, setCommitment] = useState("full-time");

  useEffect(() => {
    if (flashMessage && flashMessage.status === "success") {
      setDeleteId("");
      deleteDisclosure.onClose();
      editDisclosure.onClose();
    }
  }, [flashMessage]);

  return (
    <div>
      <Header user={user} title="Manage Jobs" />

      <SearchAndCreateRecordBar
        buttonText="New Job"
        modalTitle="New Job"
        searchValue={search_term}
        pageValue={page}
        formIntent="create"
        flashMessage={flashMessage}
      >
        <div className="flex flex-col gap-5">
          <input type="hidden" name="commitment" value={commitment} />
          <TextInput label="Title" name="title" isRequired />
          <TextareaInput label="Description" name="description" isRequired />
          <CustomSelect
            label="Commitment"
            selectedKeys={[data?.commitment]}
            onChange={(e) =>
              setData((prev) => ({ ...prev, commitment: e.target.value }))
            }
          >
            <SelectItem key={"full-time"}>Full time</SelectItem>
            <SelectItem key={"part-time"}>part-time</SelectItem>
            <SelectItem key={"contract"}>contract</SelectItem>
            <SelectItem key={"internship"}>internship</SelectItem>
          </CustomSelect>
          <TextInput type="number" label="Salary" name="salary" isRequired />
        </div>
      </SearchAndCreateRecordBar>

      <div className="px-4">
        <CustomTable
          columns={[
            "Title",
            "Description",
            "Commitment",
            "Salary",
            "Created Date",
            "Actions",
          ]}
          page={page}
          setPage={(page) =>
            navigate(`?page=${page}&search_term=${search_term}`)
          }
          totalPages={totalPages}
        >
          {jobs?.map((job: any, index: number) => (
            <TableRow key={index}>
              <TableCell>{job.title}</TableCell>
              <TableCell>{job.description}</TableCell>
              <TableCell>{job.commitment}</TableCell>
              <TableCell>{job.salary}</TableCell>
              <TableCell>
                {moment(job.createdAt).format("DD-MMM-YYYY")}
              </TableCell>
              <TableCell className="flex items-center gap-2">
                <Button
                  variant="flat"
                  color="primary"
                  size="sm"
                  onPress={() => {
                    setData(job);
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
                    setDeleteId(job._id);
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
        title="Update Frequently Asked Question"
        intent="update"
        size="lg"
      >
        <div className="flex flex-col gap-5">
          <input type="hidden" name="id" value={data?._id} />
          <input type="hidden" name="commitment" value={data?.commitment} />
          <TextInput
            label="Title"
            name="title"
            isRequired
            defaultValue={data?.title}
          />
          <TextareaInput
            label="Description"
            name="description"
            isRequired
            value={data?.description}
          />
          <CustomSelect
            // selectedKeys={[data?.commitment]}
            defaultSelectedKeys={[data?.commitment]}
            label="Commitment"
            onChange={(e) =>
              setData((prev) => ({ ...prev, commitment: e.target.value }))
            }
          >
            <SelectItem key={"full-time"}>Full time</SelectItem>
            <SelectItem key={"part-time"}>part-time</SelectItem>
            <SelectItem key={"contract"}>contract</SelectItem>
            <SelectItem key={"internship"}>internship</SelectItem>
          </CustomSelect>
          <TextInput
            type="number"
            label="Salary"
            name="salary"
            isRequired
            value={data?.salary}
          />
        </div>
      </EditRecordModal>

      {/* delete user modal */}
      <DeleteRecordModal
        isModalOpen={deleteDisclosure.isOpen}
        onCloseModal={deleteDisclosure.onClose}
        title="Delete Frequently Asked Question"
      >
        <p className="font-quicksand">
          Are you sure to delete this item? This action cannot be undone...
        </p>
        <TextInput name="id" value={deleteId} className="hidden" />
      </DeleteRecordModal>
    </div>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData.entries());

  const jobController = new JobController(request);
  if (formValues.intent === "create") {
    return jobController.createJob({
      title: formValues.title as string,
      description: formValues.description as string,
      commitment: formValues.commitment as string,
      salary: formValues.salary as string,
    });
  }
  if (formValues.intent === "update") {
    return jobController.updateJob({
      id: formValues.id as string,
      title: formValues.title as string,
      description: formValues.description as string,
      commitment: formValues.commitment as string,
      salary: formValues.salary as string,
    });
  }
  if (formValues.intent === "delete") {
    return jobController.deleteJob(formValues.id as string);
  }

  return null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const search_term = url.searchParams.get("search_term") || "";
  const page = parseInt(url.searchParams.get("page") || "1");

  const jobCtr = new JobController(request);

  const { jobs, totalPages } = await jobCtr.getJobs({
    page,
    search_term,
    limit: 15,
  });

  return {
    search_term,
    page,
    jobs,
    totalPages,
  };
};

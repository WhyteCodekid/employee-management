/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Chip,
  DatePicker,
  SelectItem,
  TableCell,
  TableRow,
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
import { FaqInterface, LeaveInterface } from "~/utils/types";
import TextareaInput from "~/components/inputs/textarea";
import FaqController from "~/controllers/FaqController";
import CustomSelect from "~/components/inputs/select";
import LeaveController from "~/controllers/LeaveController";
import moment from "moment";

export default function AdminEmployeesManagement() {
  const flashMessage = useOutletContext<{
    message: string;
    status: "error" | "success";
  }>();
  const { search_term, page, leaves, totalPages } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();

  // delete user stuff
  const deleteDisclosure = useDisclosure();
  const [faqId, setFaqId] = useState("");

  // edit user stuff
  const editDisclosure = useDisclosure();
  const [faq, setFaq] = useState<FaqInterface | null>(null);
  useEffect(() => {
    if (!editDisclosure.isOpen) {
      setFaq(null);
    }
  }, [editDisclosure.onOpenChange]);

  useEffect(() => {
    if (flashMessage && flashMessage.status === "success") {
      setFaqId("");
      deleteDisclosure.onClose();
      editDisclosure.onClose();
    }
  }, [flashMessage]);

  return (
    <div>
      <Header title="My Leave Applications" />

      <SearchAndCreateRecordBar
        buttonText="New Request"
        modalTitle="New Leave Application Request"
        searchValue={search_term}
        pageValue={page}
        formIntent="new-leave-request"
        flashMessage={flashMessage}
      >
        <div className="flex flex-col gap-5">
          <CustomSelect name="type" label="Leave Type">
            {[
              { label: "Sick leave", value: "sick" },
              { label: "Maternity leave", value: "maternity" },
              { label: "Annual leave", value: "annual" },
              { label: "Unpaid leave", value: "unpaid" },
            ].map((option) => (
              <SelectItem key={option.value}>{option.label}</SelectItem>
            ))}
          </CustomSelect>
          <DatePicker
            variant="bordered"
            color="success"
            labelPlacement="outside"
            className="font-quicksand"
            dateInputClassNames={{
              label:
                "font-medium font-montserrat text-slate-800 dark:text-slate-100",
            }}
            label="Start Date"
            name="startDate"
          />
          <DatePicker
            variant="bordered"
            color="success"
            labelPlacement="outside"
            className="font-quicksand"
            classNames={{
              label:
                "font-medium font-montserrat text-slate-800 dark:text-slate-100",
            }}
            dateInputClassNames={{
              label:
                "font-medium font-montserrat text-slate-800 dark:text-slate-100",
            }}
            label="End Date"
            name="endDate"
          />
          <TextareaInput label="Reason" name="reason" />
        </div>
      </SearchAndCreateRecordBar>

      <div className="px-4">
        <CustomTable
          columns={[
            "Type",
            "Start Date",
            "End Date",
            "Status",
            "Reason",
            "Actions",
          ]}
          page={page}
          setPage={(page) =>
            navigate(`?page=${page}&search_term=${search_term}`)
          }
          totalPages={totalPages}
        >
          {leaves?.map((leave: LeaveInterface, index: number) => (
            <TableRow key={index}>
              <TableCell className="capitalize">{leave.type} leave</TableCell>
              <TableCell>
                {moment(leave.startDate).format("DD/MM/YYYY")}
              </TableCell>
              <TableCell>
                {moment(leave.endDate).format("DD/MM/YYYY")}
              </TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  className="font-quicksand font-semibold capitalize"
                  variant="flat"
                  color={`${
                    leave.status === "pending"
                      ? "warning"
                      : leave.status === "approved"
                      ? "success"
                      : "danger"
                  }`}
                >
                  {leave.status}
                </Chip>
              </TableCell>
              <TableCell>{leave.reason}</TableCell>
              <TableCell className="flex items-center gap-2">
                <Button
                  variant="flat"
                  color="primary"
                  size="sm"
                  onPress={() => {
                    setFaq(faq);
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
                    setFaqId(faq._id);
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
        intent="update-faq"
        size="lg"
      >
        <div className="flex flex-col gap-5">
          <TextInput
            label="Faq ID"
            name="id"
            value={faq?._id}
            className="hidden"
          />
          <TextInput
            label="Question"
            name="question"
            value={faq?.question}
            onValueChange={(value) =>
              setFaq((prev: any) => ({
                ...prev,
                question: value as string,
              }))
            }
          />
          <TextareaInput
            label="Answer"
            name="answer"
            value={faq?.answer}
            onValueChange={(value) =>
              setFaq((prev: any) => ({
                ...prev,
                answer: value as string,
              }))
            }
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
          Are you sure to delete this frequently asked question? This action
          cannot be undone...
        </p>
        <TextInput name="id" value={faqId} className="hidden" />
      </DeleteRecordModal>
    </div>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData.entries());

  const faqController = new FaqController(request);
  const leaveController = new LeaveController(request);

  if (formValues.intent === "new-leave-request") {
    return await leaveController.requestLeave({
      type: formValues.type as string,
      startDate: formValues.startDate as string,
      endDate: formValues.endDate as string,
      reason: formValues.reason as string,
    });
  }
  if (formValues.intent === "update-faq") {
    return faqController.updateFaq({
      id: formValues.id as string,
      question: formValues.question as string,
      answer: formValues.answer as string,
    });
  }
  if (formValues.intent === "delete") {
    return faqController.deleteFaq({ id: formValues.id as string });
  }

  return null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const status = url.searchParams.get("status") || "";
  const search_term = url.searchParams.get("search_term") || "";
  const page = parseInt(url.searchParams.get("page") || "1");

  const leaveController = new LeaveController(request);
  const { leaves, totalPages } = await leaveController.getLeaves({
    page,
    search_term,
    limit: 15,
    status,
  });

  console.log(leaves);

  return {
    search_term,
    page,
    leaves,
    totalPages,
  };
};

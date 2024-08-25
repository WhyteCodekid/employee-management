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
import { FaqInterface, UserInterface } from "~/utils/types";
import * as faceapi from "face-api.js";
import TextareaInput from "~/components/inputs/textarea";
import FaqController from "~/controllers/FaqController";

export default function AdminEmployeesManagement() {
  const flashMessage = useOutletContext<{
    message: string;
    status: "error" | "success";
  }>();
  const { search_term, page, faqs, totalPages } =
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
          {faqs?.map((faq: FaqInterface, index: number) => (
            <TableRow key={index}>
              <TableCell>{faq.question}</TableCell>
              <TableCell>{faq.answer}</TableCell>
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

  const userController = new UserController(request);
  const faqController = new FaqController(request);
  if (formValues.intent === "create-faq") {
    return faqController.createFaq({
      question: formValues.question as string,
      answer: formValues.answer as string,
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
  const search_term = url.searchParams.get("search_term") || "";
  const page = parseInt(url.searchParams.get("page") || "1");

  const faqController = new FaqController(request);
  const { faqs, totalPages } = await faqController.getFaqs({
    page,
    search_term,
    limit: 15,
  });

  return {
    search_term,
    page,
    faqs,
    totalPages,
  };
};

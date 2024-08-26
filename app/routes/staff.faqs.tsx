/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Accordion,
  AccordionItem,
  Button,
  Input,
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
import { FaqInterface } from "~/utils/types";
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
      <Header title="Frequently Asked Questions" />

      <div className="flex items-center justify-between py-4 px-4">
        <Input
          value={search_term}
          onValueChange={(value) =>
            navigate(`?search_term=${value || ""}&page=${page || ""}`)
          }
          variant="bordered"
          placeholder="Search here..."
          className="w-1/4"
          classNames={{
            inputWrapper: "bg-white dark:bg-transparent",
          }}
          color="success"
          aria-labelledby="search input"
        />
      </div>

      <div className="px-4">
        <div className="md:!h-[85vh] h-[65vh] overflow-y-auto w-screen md:w-full overflow-x-auto  shadow-none rounded-2xl dark:border border-white/5 vertical-scrollbar horizontal-scrollbar p-4">
          <Accordion variant="splitted">
            {faqs?.map((faq: FaqInterface, index: number) => (
              <AccordionItem
                key={`faq ${index}`}
                aria-label="Accordion 1"
                title={faq.question}
              >
                {faq.answer}
              </AccordionItem>
            ))}
          </Accordion>
        </div>
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

  console.log(faqs);

  return {
    search_term,
    page,
    faqs,
    totalPages,
  };
};

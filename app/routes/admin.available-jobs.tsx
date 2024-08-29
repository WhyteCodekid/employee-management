import {
  Button,
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
import TextareaInput from "~/components/inputs/textarea";
import FaqController from "~/controllers/FaqController";
import { UsersCombobox } from "~/components/inputs/combobox";
import PayrollController from "~/controllers/PayrollController";
import CustomSelect from "~/components/inputs/select";
import moment from "moment";

export default function AvaibleJobs() {
  const flashMessage = useOutletContext<{
    message: string;
    status: "error" | "success";
  }>();
  const { search_term, page, deductionBonus, totalPages } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();

  // delete user stuff
  const deleteDisclosure = useDisclosure();
  const [faqId, setFaqId] = useState("");

  // edit user stuff
  const editDisclosure = useDisclosure();
  const [transaction, setTransaction] = useState<any | null>(null);
  useEffect(() => {
    if (!editDisclosure.isOpen) {
      setTransaction(null);
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
      <Header title="Manage Jobs" />

      <SearchAndCreateRecordBar
        buttonText="New Transaction"
        modalTitle="Add Job"
        searchValue={search_term}
        pageValue={page}
        formIntent="new-transaction"
        flashMessage={flashMessage}
      >
        <div className="flex flex-col gap-5">
          <UsersCombobox />
          <TextInput label="Amount" name="amount" isRequired />
          <CustomSelect label="Transaction Type" name="type">
            <SelectItem key={"bonus"}>Bonus</SelectItem>
            <SelectItem key={"deduction"}>Deductions</SelectItem>
          </CustomSelect>
        </div>
      </SearchAndCreateRecordBar>

      <div className="px-4">
        <CustomTable
          columns={[
            "Date",
            "Employee",
            "Transaction Type",
            "Amount",
            "Actions",
          ]}
          page={page}
          setPage={(page) =>
            navigate(`?page=${page}&search_term=${search_term}`)
          }
          totalPages={totalPages}
        >
          {deductionBonus?.map((transaction: any, index: number) => (
            <TableRow key={index}>
              <TableCell>
                {moment(transaction.createdAt).format("DD-MMM-YYYY")}
              </TableCell>
              <TableCell>{transaction.user?.firstName}</TableCell>
              <TableCell>{transaction.type}</TableCell>
              <TableCell>{transaction.amount}</TableCell>
              <TableCell className="flex items-center gap-2">
                <Button
                  variant="flat"
                  color="primary"
                  size="sm"
                  onPress={() => {
                    setTransaction(transaction);
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
                    // setFaqId(faq._id);
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
            label="Select Employee"
            name="id"
            value={transaction?.user?._id}
            className="hidden"
          />
          <TextInput
            label="Question"
            name="question"
            value={transaction?.amount}
            // onValueChange={(value) =>
            //   setFaq((prev: any) => ({
            //     ...prev,
            //     question: value as string,
            //   }))
            // }
          />
          <TextareaInput
            label="Answer"
            // name="answer"
            // value={faq?.answer}
            // onValueChange={(value) =>
            //   setFaq((prev: any) => ({
            //     ...prev,
            //     answer: value as string,
            //   }))
            // }
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
  const payrollController = new PayrollController(request);
  if (formValues.intent === "new-transaction") {
    return payrollController.createDeductionBonus({
      user: formValues.user as string,
      type: formValues.type as string,
      amount: formValues.amount as string,
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

  const payrollController = new PayrollController(request);

  const { deductionBonus, totalPages } =
    await payrollController.getDeductionBonuses({
      page,
      search_term,
      limit: 15,
    });

  return {
    search_term,
    page,
    deductionBonus,
    totalPages,
  };
};

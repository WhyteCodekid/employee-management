import {
  Accordion,
  AccordionItem,
  Button,
  Chip,
  DatePicker,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  SelectItem,
  TableCell,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import axios from "axios";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import CustomSelect from "~/components/inputs/select";
import TextareaInput from "~/components/inputs/textarea";
import CreateRecordModal from "~/components/modals/CreateRecord";
import CustomTable from "~/components/ui/new-table";
import ThemeSwitcher from "~/components/ui/theme-switcher";
import UserDropdown from "~/components/ui/user-dropdown";
import FaqController from "~/controllers/FaqController";
import LeaveController from "~/controllers/LeaveController";
import PayrollController from "~/controllers/PayrollController";
import UserController from "~/controllers/UserController";
import { FaqInterface, LeaveInterface } from "~/utils/types";

import pkg from "react-to-print";
const { useReactToPrint } = pkg;

export default function AdminLayout() {
  const navigate = useNavigate();
  const { flashMessage } = useOutletContext<{
    flashMessage: { title: string; status: "error" | "success" };
  }>();
  const { user, search_term, page, leaves, totalPages, faqs } =
    useLoaderData<typeof loader>();

  const [payslipLoading, setPayslipLoading] = useState(false);
  const [payslipHistory, setPayslipHistory] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const requestLeaveDisclosure = useDisclosure();
  const payslipDisclosure = useDisclosure();

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const attendanceComponentRef = useRef();
  const handleAttendancePrint = useReactToPrint({
    content: () => attendanceComponentRef.current,
  });

  const generatePayslip = async () => {
    await axios.get("/api/generate-payslip").then((response) => {
      console.log(response.data);
      setPayslipHistory(response?.data?.deductionBonuses);
      setTotalAmount(response?.data?.totalSalary);
      setTimeout(() => {
        setPayslipLoading(false);
        payslipDisclosure.onOpen();
      }, 5000);
    });
  };

  useEffect(() => {
    requestLeaveDisclosure.onClose();
  }, [leaves]);

  return (
    <div className="min-h-screen pb-6 flex flex-col gap-5 bg-slate-300/30 dark:bg-content1">
      {/* top nav */}
      <div className="h-16 bg-white px-4 dark:bg-content2 flex items-center justify-between sticky top-0 z-50">
        <h1 className="font-montserrat font-bold text-lg">
          Staff Interface | AEMS
        </h1>

        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <UserDropdown user={user} />
        </div>
      </div>

      {/* page content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 px-4 gap-x-10">
        <div className="grid grid-cols-1">
          <div className="rounded-3xl bg-white dark:bg-content2 px-4 py-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-montserrat font-semibold text-lg">
                My Profile
              </h2>

              <Button
                size="sm"
                color="success"
                className="font-montserrat text-white"
              >
                Edit Profile
              </Button>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-full border-2 border-green-500 size-20 overflow-hidden">
                <img
                  src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                  className="object-cover object-center w-full h-full"
                />
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="font-montserrat text-2xl font-medium">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p> {user?.email}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5">
          {/* frequently asked questions */}
          <div className="rounded-3xl bg-white dark:bg-content2 p-5 flex flex-col gap-4">
            <h2 className="font-montserrat font-semibold text-lg">
              Frequently Asked Questions
            </h2>

            <Accordion
              variant="splitted"
              itemClasses={{
                title: "font-montserrat text-base",
                content: "font-quicksand text-sm",
              }}
            >
              {faqs?.map((faq: FaqInterface) => (
                <AccordionItem
                  title={faq.question}
                  subtitle={
                    <p className="text-xs font-quicksand opacity-70">
                      {moment(faq.createdAt).fromNow()}
                    </p>
                  }
                >
                  {faq.answer}
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="rounded-3xl bg-white dark:bg-content2"></div>
        </div>

        <div className="grid grid-cols-1 gap-5">
          <div className="rounded-3xl bg-white dark:bg-content2 px-4 py-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-montserrat font-semibold text-lg">
                Financial History
              </h2>

              <Button
                size="sm"
                color="success"
                className="font-montserrat text-white"
                isLoading={payslipLoading}
                onClick={() => {
                  setPayslipLoading(true);
                  generatePayslip();
                }}
              >
                {payslipLoading
                  ? "AI is generating Payslip"
                  : "Generate Payslip"}
              </Button>
            </div>

            {/* leaves table */}
            <CustomTable
              columns={["Date", "Amount", "Transaction Type"]}
              page={page}
              setPage={(page) =>
                navigate(`?page=${page}&search_term=${search_term}`)
              }
              totalPages={totalPages}
              customHeightClass="h-full"
            >
              {deductionBonus?.map((transaction: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>
                    {moment(transaction.createdAt).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell className="capitalize">
                    {transaction.type} leave
                  </TableCell>
                  <TableCell>
                    {moment(transaction.amount).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      className="font-quicksand font-semibold capitalize"
                      variant="flat"
                      color={`${
                        transaction.type === "bonus" ? "success" : "danger"
                      }`}
                    >
                      {transaction.type}
                    </Chip>
                  </TableCell>
                </TableRow>
              ))}
            </CustomTable>
          </div>

          {/* leave applications */}
          <div className="rounded-3xl bg-white dark:bg-content2 py-4 flex flex-col gap-3">
            <div className="flex items-center justify-between px-4">
              <h2 className="font-montserrat font-semibold text-lg">
                Leave Applications
              </h2>

              <div className="flex items-center gap-3">
                <Button
                  color="warning"
                  size="sm"
                  className="font-montserrat text-white"
                  onPress={() => {
                    handleAttendancePrint();
                  }}
                >
                  Print history
                </Button>

                <Button
                  size="sm"
                  color="success"
                  className="font-montserrat text-white"
                  onPress={() => requestLeaveDisclosure.onOpen()}
                >
                  Request Leave
                </Button>
              </div>
            </div>

            {/* leaves table */}
            <div ref={attendanceComponentRef}>
              <div className="flex-col px-5 gap-1 hidden print:flex ">
                <h3 className="font-montserrat text-2xl font-medium">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p>Email: {user?.email}</p>
                <p>Staff ID: {user?.staffId}</p>

                <div>
                  <p className="font-semibold text-lg">Attendance History</p>
                </div>
              </div>

              <CustomTable
                columns={["Type", "Start Date", "End Date", "Status", "Reason"]}
                page={page}
                setPage={(page) =>
                  navigate(`?page=${page}&search_term=${search_term}`)
                }
                totalPages={totalPages}
                customHeightClass="h-full"
              >
                {leaves?.map((leave: LeaveInterface, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="capitalize">
                      {leave.type} leave
                    </TableCell>
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
                  </TableRow>
                ))}
              </CustomTable>
            </div>
          </div>
        </div>
      </div>

      <CreateRecordModal
        isOpen={requestLeaveDisclosure.isOpen}
        onOpenChange={requestLeaveDisclosure.onOpenChange}
        onCloseModal={requestLeaveDisclosure.onClose}
        title="Request Leave Application"
        actionText="Submit"
        intent="request-leave"
      >
        <div className="flex flex-col gap-4">
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
      </CreateRecordModal>

      <Modal
        isOpen={payslipDisclosure.isOpen}
        onOpenChange={payslipDisclosure.onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Payslip History
              </ModalHeader>
              <ModalBody ref={componentRef}>
                <div className="flex flex-col gap-1 hidden print:flex ">
                  <h3 className="font-montserrat text-2xl font-medium">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p>Email: {user?.email}</p>
                  <p>Staff ID: {user?.staffId}</p>

                  <div>
                    <p className="font-semibold text-lg">Your Pay slip</p>
                    <p>Total Amount: GH₵ {totalAmount}</p>
                  </div>
                </div>

                <CustomTable
                  columns={["Date", "Amount", "Transaction Type"]}
                  page={page}
                  setPage={(page) =>
                    navigate(`?page=${page}&search_term=${search_term}`)
                  }
                  totalPages={totalPages}
                >
                  {payslipHistory?.map((transaction: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>
                        {moment(transaction.createdAt).format("Do MMMM, YYYY")}
                      </TableCell>
                      <TableCell>{transaction.amount}</TableCell>
                      <TableCell className="capitalize">
                        {transaction.type}
                      </TableCell>
                    </TableRow>
                  ))}
                </CustomTable>
              </ModalBody>
              <ModalFooter>
                <Button
                  size="sm"
                  color="danger"
                  variant="faded"
                  onPress={onClose}
                >
                  Close
                </Button>
                <Button
                  color="warning"
                  size="sm"
                  className="font-montserrat text-white"
                  onPress={() => {
                    handlePrint();
                    onClose();
                  }}
                >
                  Print Pay slip
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData.entries());

  const faqController = new FaqController(request);
  const leaveController = new LeaveController(request);

  if (formValues.intent === "request-leave") {
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

  const adminControlle = new UserController(request);
  const user = await adminControlle.getUser();

  const leaveController = new LeaveController(request);
  const { leaves, totalPages } = await leaveController.getMyLeaves({
    page,
    limit: 8,
    status,
  });

  const faqsController = new FaqController(request);
  const { faqs } = await faqsController.getFaqs({
    page,
    limit: 8,
  });

  const payrollController = new PayrollController(request);
  const { deductionBonus } = await payrollController.getUserPayrollHistory({
    page,
    limit: 15,
    month: new Date().toLocaleDateString(),
  });

  return { user, search_term, page, leaves, totalPages, faqs, deductionBonus };
};

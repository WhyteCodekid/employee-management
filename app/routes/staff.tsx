import {
  Accordion,
  AccordionItem,
  Button,
  Chip,
  DatePicker,
  SelectItem,
  TableCell,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import moment from "moment";
import CustomSelect from "~/components/inputs/select";
import TextareaInput from "~/components/inputs/textarea";
import CreateRecordModal from "~/components/modals/CreateRecord";
import CustomTable from "~/components/ui/new-table";
import Sidebar, { StaffSidebar } from "~/components/ui/sidebar";
import ThemeSwitcher from "~/components/ui/theme-switcher";
import FaqController from "~/controllers/FaqController";
import LeaveController from "~/controllers/LeaveController";
import UserController from "~/controllers/UserController";
import { FaqInterface, LeaveInterface } from "~/utils/types";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { flashMessage } = useOutletContext<{
    flashMessage: { title: string; status: "error" | "success" };
  }>();
  const { user, search_term, page, leaves, totalPages, faqs } =
    useLoaderData<typeof loader>();
  console.log(user);

  const requestLeaveDisclosure = useDisclosure();

  return (
    <div className="min-h-screen pb-6 flex flex-col gap-5 bg-slate-300/30 dark:bg-content1">
      {/* top nav */}
      <div className="h-16 bg-white px-4 dark:bg-content2 flex items-center justify-between">
        <h1 className="font-montserrat font-bold text-lg">
          Staff Interface | AEMS
        </h1>

        <ThemeSwitcher />
      </div>

      {/* page content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 px-4 gap-x-10">
        <div className="grid grid-cols-1">
          <div className="rounded-3xl bg-white dark:bg-content2 px-4 py-4 flex flex-col gap-3">
            <h2 className="font-montserrat font-semibold text-lg">
              My Profile
            </h2>

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
                Reimbursements
              </h2>

              <Button
                size="sm"
                color="success"
                className="font-montserrat text-white"
              >
                Generate Payslip
              </Button>
            </div>
          </div>

          {/* leave applications */}
          <div className="rounded-3xl bg-white dark:bg-content2 py-4 flex flex-col gap-3">
            <div className="flex items-center justify-between px-4">
              <h2 className="font-montserrat font-semibold text-lg">
                Leave Applications
              </h2>

              <Button
                size="sm"
                color="success"
                className="font-montserrat text-white"
                onPress={() => requestLeaveDisclosure.onOpen()}
              >
                Request Leave
              </Button>
            </div>

            {/* leaves table */}
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

  return { user, search_term, page, leaves, totalPages, faqs };
};

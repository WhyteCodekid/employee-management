/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Chip,
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
import { FaqInterface, LeaveInterface } from "~/utils/types";
import TextareaInput from "~/components/inputs/textarea";
import FaqController from "~/controllers/FaqController";
import LeaveController from "~/controllers/LeaveController";
import moment from "moment";

export default function AdminEmployeesManagement() {
  const flashMessage = useOutletContext<{
    message: string;
    status: "error" | "success";
  }>();
  const { search_term, page, leaves, totalPages, status } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();

  // delete user stuff
  const approveDisclosure = useDisclosure();
  const [leaveId, setLeaveId] = useState("");

  // edit user stuff
  const declineDisclosure = useDisclosure();

  useEffect(() => {
    if (flashMessage && flashMessage.status === "success") {
      setLeaveId("");
      approveDisclosure.onClose();
      declineDisclosure.onClose();
    }
  }, [flashMessage]);

  return (
    <div>
      <Header title="Employees Leave Management" />

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
        <CustomTable
          columns={[
            "Employee Name",
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
              <TableCell>
                {leave.user.firstName} {leave.user.lastName}
              </TableCell>
              <TableCell>{leave.type}</TableCell>
              <TableCell>
                {moment(leave.startDate).format("DD/MM/YYYY")}
              </TableCell>
              <TableCell>
                {moment(leave.endDate).format("DD/MM/YYYY")}
              </TableCell>
              <TableCell>
                {" "}
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
                  color="success"
                  size="sm"
                  onPress={() => {
                    setLeaveId(leave._id);
                    approveDisclosure.onOpen();
                  }}
                  isDisabled={leave.status !== "pending"}
                >
                  Approve
                </Button>
                <Button
                  variant="flat"
                  color="danger"
                  size="sm"
                  onPress={() => {
                    setLeaveId(leave._id);
                    declineDisclosure.onOpen();
                  }}
                  isDisabled={leave.status !== "pending"}
                >
                  Decline
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </CustomTable>
      </div>

      {/* edit user modal */}
      <EditRecordModal
        isModalOpen={approveDisclosure.isOpen}
        onCloseModal={approveDisclosure.onClose}
        title="Approve Leave Request"
        intent="approve-request"
        size="lg"
      >
        <p className="font-quicksand">
          Are you sure to approve this leave request?
        </p>
        <TextInput name="id" value={leaveId} className="hidden" />
      </EditRecordModal>

      {/* edit user modal */}
      <EditRecordModal
        isModalOpen={declineDisclosure.isOpen}
        onCloseModal={declineDisclosure.onClose}
        title="Decline Leave Request"
        intent="decline-request"
        size="lg"
      >
        <p className="font-quicksand">
          Are you sure to decline this leave request?
        </p>
        <TextInput name="id" value={leaveId} className="hidden" />
      </EditRecordModal>
    </div>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData.entries());

  const leaveController = new LeaveController(request);
  if (formValues.intent === "approve-request") {
    return await leaveController.changeStatus({
      id: formValues.id as string,
      status: "approved",
    });
  }

  if (formValues.intent === "decline-request") {
    return await leaveController.changeStatus({
      id: formValues.id as string,
      status: "declined",
    });
  }

  return null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const search_term = url.searchParams.get("search_term") || "";
  const status = url.searchParams.get("status") || "";
  const page = parseInt(url.searchParams.get("page") || "1");

  const leaveController = new LeaveController(request);

  const { leaves, totalPages } = await leaveController.getLeaves({
    page,
    search_term,
    limit: 15,
    status,
  });

  return {
    search_term,
    page,
    leaves,
    status,
    totalPages,
  };
};

import pkg from "react-to-print";
import { useRef } from "react";
import UserController from "~/controllers/UserController";
import { LoaderFunction } from "@remix-run/node";
import PayrollController from "~/controllers/PayrollController";
import AttendanceController from "~/controllers/AttendanceController";
import CustomTable from "~/components/ui/new-table";
import { UserInterface } from "~/utils/types";
import { Button, Card, Chip, TableCell, TableRow } from "@nextui-org/react";
import { useLoaderData, useNavigate } from "@remix-run/react";

import moment from "moment";
const { useReactToPrint } = pkg;

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const chartData = [
  {
    name: "February",
    approved: 4000,
    rejected: 2400,
    amt: 2400,
  },
  {
    name: "March",
    approved: 3000,
    rejected: 1398,
    amt: 2210,
  },
  {
    name: "April",
    approved: 9800,
    rejected: 2000,
    amt: 2290,
  },
  {
    name: "May",
    approved: 2780,
    rejected: 3908,
    amt: 2000,
  },
  {
    name: "June",
    approved: 1890,
    rejected: 4800,
    amt: 2181,
  },
  {
    name: "July",
    approved: 2390,
    rejected: 3800,
    amt: 2500,
  },
  {
    name: "August",
    approved: 3490,
    rejected: 4300,
    amt: 2100,
  },
];

export default function AnalyticsIndex() {
  const { search_term, page, users, deductionBonus, attendances } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className="mx-5">
      <div className="h-24 flex items-center">
        <Button onClick={handlePrint}>Print Report</Button>
      </div>
      <div ref={componentRef} className="flex flex-col gap-11 pb-20">
        <CustomTable
          columns={["Staff ID", "Full Name", "Email", "Phone", "Role"]}
          page={1}
          setPage={(page) =>
            navigate(`?page=${page}&search_term=${search_term}`)
          }
          totalPages={1}
        >
          {users?.map((employee: UserInterface, index: number) => (
            <TableRow key={index}>
              <TableCell>{`AEMS${employee.staffId}`}</TableCell>
              <TableCell>{`${employee.firstName} ${employee.lastName}`}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.phone}</TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  variant="flat"
                  classNames={{ content: "capitalize" }}
                  color={employee.role === "admin" ? "success" : "warning"}
                >
                  {employee.role}
                </Chip>
              </TableCell>
            </TableRow>
          ))}
        </CustomTable>

        <CustomTable
          columns={["Date", "Employee", "Transaction Type", "Amount"]}
          page={page}
          setPage={(page) =>
            navigate(`?page=${page}&search_term=${search_term}`)
          }
          totalPages={1}
        >
          {deductionBonus?.map((transaction: any, index: number) => (
            <TableRow key={index}>
              <TableCell>
                {moment(transaction.createdAt).format("DD-MMM-YYYY")}
              </TableCell>
              <TableCell>{transaction.user?.firstName}</TableCell>
              <TableCell>{transaction.type}</TableCell>
              <TableCell>{transaction.amount}</TableCell>
            </TableRow>
          ))}
        </CustomTable>

        <CustomTable
          columns={[
            "Staff ID",
            "Staff Name",
            "Date",
            "Time In",
            "Time Out",
            "Status",
          ]}
          page={page}
          setPage={(page) =>
            navigate(`?page=${page}&search_term=${search_term}`)
          }
          totalPages={1}
        >
          {attendances?.map((department, index) => (
            <TableRow key={index}>
              <TableCell>{department.name}</TableCell>
              <TableCell>{department.description}</TableCell>
              <TableCell>{department.description}</TableCell>
              <TableCell>{department.description}</TableCell>
              <TableCell>{department.description}</TableCell>
              <TableCell>{department.description}</TableCell>
            </TableRow>
          ))}
        </CustomTable>

        <Card className="w-full h-[65vh] dark:bg-slate-800 rounded-xl p-4">
          <p>Statistics</p>

          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              width={500}
              height={400}
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorApr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="green" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="green" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRjt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="red" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="red" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="approved"
                stroke="green"
                fill="url(#colorApr)"
              />
              <Area
                type="monotone"
                dataKey="rejected"
                stroke="red"
                fill="url(#colorRjt)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const search_term = url.searchParams.get("search_term") || "";
  const page = parseInt(url.searchParams.get("page") || "1");

  const userController = new UserController(request);
  const { users } = await userController.getUsers({
    page,
    search_term,
    limit: 100,
  });

  const payrollController = new PayrollController(request);
  const { deductionBonus } = await payrollController.getDeductionBonuses({
    page,
    search_term,
    limit: 100,
  });

  const attendanceController = await new AttendanceController(request);
  const { attendances } = await attendanceController.getAttendances({
    page,
    search_term,
    limit: 100,
  });

  return {
    users,
    deductionBonus,
    attendances,
  };
};

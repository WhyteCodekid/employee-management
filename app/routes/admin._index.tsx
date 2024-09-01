import { Button, Card } from "@nextui-org/react";
import { useLoaderData } from "@remix-run/react";
import moment from "moment";
import { LoaderFunction, useOutletContext } from "react-router";
import Header from "~/components/ui/header";
import DashboardController from "~/controllers/DashboardController";
import JobController from "~/controllers/JobController";
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
    approved: 2000,
    rejected: 9800,
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

export default function AdminDashboard() {
  const { data, applications } = useLoaderData();
  const { user } = useOutletContext();

  return (
    <div className="flex flex-col gap-5 h-full">
      <Header user={user} title="Admin Dashboard" />

      <section className="grid grid-cols-4 gap-5 mx-5">
        <Card className="bg-white dark:bg-slate-800 flex flex-col rounded-xl p-4 h-32">
          <p className="text-4xl font-bold">{data?.pendingLeaves}</p>
          <p className="ml-auto mt-auto">Pending Leaves</p>
        </Card>

        <Card className="bg-white dark:bg-slate-800 flex flex-col rounded-xl p-4 h-32">
          <p className="text-4xl font-bold">{data?.approvedLeaves}</p>
          <p className="ml-auto mt-auto">Approved Leaves</p>
        </Card>

        <Card className="bg-white dark:bg-slate-800 flex flex-col rounded-xl p-4 h-32">
          <p className="text-4xl font-bold">{data?.rejectedLeaves}</p>
          <p className="ml-auto mt-auto">Rejected Leaves</p>
        </Card>

        <Card className="bg-white dark:bg-slate-800 flex flex-col rounded-xl p-4 h-32">
          <p className="text-4xl font-bold">{data?.totalUsers}</p>
          <p className="ml-auto mt-auto">Total Users</p>
        </Card>
      </section>

      <section className="flex gap-3 mx-5">
        <Card className="w-[65%] h-[65vh] dark:bg-slate-800 rounded-xl p-4">
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

        <Card className="w-[35%] dark:bg-slate-800 flex flex-col rounded-xl p-4 h-32">
          <p className="text-lg font-semibold">Recent Applications</p>
          <div className="flex flex-col gap-3 mt-5">
            {applications.map((application) => (
              <div
                key={application?._id}
                className="flex justify-between p-2 rounded-2xl bg-slate-100"
              >
                <p className="font-semibold">{application?.fullName}</p>
                <p>{moment(application?.ceratedAt).format("Do MMMM, YYYY")}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const dashboardCtrl = new DashboardController(request);

  const jobCtrl = new JobController(request);
  const { applications } = await jobCtrl.getApplications();

  const data = await dashboardCtrl.getDashboardData();

  return {
    data,
    applications,
  };
};

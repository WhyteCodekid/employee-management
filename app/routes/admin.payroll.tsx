import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import CustomSelect from "~/components/inputs/select";
import Header from "~/components/ui/header";

export default function AdminPayroll() {
  const { payrollMonth } = useLoaderData<typeof loader>();
  console.log(payrollMonth);

  return (
    <div>
      <Header title="Payroll Management" />

      <div className="flex items-center justify-end"></div>
    </div>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const payrollMonth = url.searchParams.get("month");

  return {
    payrollMonth,
  };
};

import { LoaderFunction } from "@remix-run/node";
import PayrollController from "~/controllers/PayrollController";
import UserController from "~/controllers/UserController";

export const loader: LoaderFunction = async ({ request }) => {
  const payrollController = new PayrollController(request);

  const url = new URL(request.url);
  const search_term = url.searchParams.get("search_term") as string;
  const page = url.searchParams.get("page") as string;
  const limit = url.searchParams.get("limit") as string;

  return await payrollController.generatePayslip({});
};

import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import AdminController from "~/controllers/UserController";

export const loader: LoaderFunction = async ({ request }) => {
  const adminAuthControlle = await new AdminController(request);
  return await adminAuthControlle.logout();
};

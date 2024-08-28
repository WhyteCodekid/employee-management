import { LoaderFunction } from "@remix-run/node";
import UserController from "~/controllers/UserController";

export const loader: LoaderFunction = async ({ request }) => {
  const userController = new UserController(request);

  const url = new URL(request.url);
  const search_term = url.searchParams.get("search_term") as string;
  const page = url.searchParams.get("page") as string;
  const limit = url.searchParams.get("limit") as string;

  return await userController.getUsers({
    search_term,
    page: parseInt(page),
    limit: parseInt(limit) || 10,
  });
};

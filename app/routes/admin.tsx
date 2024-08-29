import { LoaderFunction } from "@remix-run/node";
import { Outlet, useOutletContext } from "@remix-run/react";
import Sidebar from "~/components/ui/sidebar";
import UserController from "~/controllers/UserController";

export default function AdminLayout() {
  const { flashMessage } = useOutletContext<{
    flashMessage: { title: string; status: "error" | "success" };
  }>();

  return (
    <div className=" flex bg-slate-300/30 dark:bg-content1">
      <Sidebar />
      {/* <div className="w-[17%] h-full border-r bg-white dark:bg-slate-900 dark:border-white/10 flex flex-col"></div> */}
      <div className="flex-1 h-full">
        <Outlet context={flashMessage} />
      </div>
    </div>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const adminControlle = new UserController(request);
  const user = await adminControlle.getUser();

  return {};
};

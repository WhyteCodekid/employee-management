import { Outlet } from "@remix-run/react";
import Sidebar from "~/components/ui/sidebar";

export default function AdminLayout() {
  return (
    <div className="h-screen flex bg-slate-300/30 dark:bg-content1">
      <Sidebar />
      {/* <div className="w-[17%] h-full border-r bg-white dark:bg-slate-900 dark:border-white/10 flex flex-col"></div> */}
      <div className="flex-1 h-full">
        <Outlet />
      </div>
    </div>
  );
}

import { NavLink, Outlet } from "@remix-run/react";
import React from "react";
import Header from "~/components/ui/header";

export default function AdminAnalytics() {
  return (
    <div>
      <Header title="Analytics" />

      <div className="flex gap-5 mx-5">
        <NavLink to="/admin/analytics">Top nav</NavLink>
        <NavLink to="/admin/analytics/">Top nav</NavLink>
      </div>

      <Outlet />
    </div>
  );
}

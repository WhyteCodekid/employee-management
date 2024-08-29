import { NavLink, Outlet } from "@remix-run/react";
import React from "react";
import Header from "~/components/ui/header";

export default function AdminAnalytics() {
  return (
    <div>
      <Header title="Analytics" />

      <Outlet />
    </div>
  );
}

import { NavLink, Outlet, useOutletContext } from "@remix-run/react";
import React from "react";
import Header from "~/components/ui/header";

export default function AdminAnalytics() {
  const { user } = useOutletContext();

  return (
    <div>
      <Header user={user} title="Analytics" />

      <Outlet />
    </div>
  );
}

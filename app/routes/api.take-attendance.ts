import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import Attendance from "~/models/Attendance";

export const action: ActionFunction = async ({ request }) => {
  const payload = await request.json();
  console.log(payload);

  return true;
  const eixtingRecord = await Attendance.findOne({
    user: payload.user,
    chekInTime: payload.date,
  });

  if (eixtingRecord) {
    await Attendance.findByIdAndUpdate(eixtingRecord._id, {
      chekOutTime: payload.date,
    });
  } else {
    await Attendance.create(payload);
  }
};

export const loader = async () => redirect("/");

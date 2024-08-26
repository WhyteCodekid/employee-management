import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import Attendance from "~/models/Attendance";

export const action: ActionFunction = async ({ request }) => {
  const payload = await request.json();

  const currentTime = new Date(payload.date);
  const oneHourInMilliseconds = 60 * 60 * 1000;

  // Check for existing attendance record for the user
  const existingRecord = await Attendance.findOne({
    user: payload.user,
    chekInTime: {
      $gte: new Date(
        currentTime.getFullYear(),
        currentTime.getMonth(),
        currentTime.getDate()
      ),
    },
  });

  if (existingRecord) {
    // Check if checkout time is already recorded
    if (existingRecord.chekOutTime) {
      return { error: "User has already signed out for today." };
    }

    // Update the existing record with checkout time
    await Attendance.findByIdAndUpdate(existingRecord._id, {
      chekOutTime: currentTime,
    });
  } else {
    // Validate check-in time (within 1 hour of the current time)
    if (
      currentTime.getTime() - new Date(payload.chekInTime).getTime() >
      oneHourInMilliseconds
    ) {
      return {
        error: "Check-in time must be within 1 hour of the current time.",
      };
    }

    // Create a new attendance record
    await Attendance.create({
      user: payload.user,
      chekInTime: new Date(0),
    });
  }

  return redirect("/");
};

export const loader = async () => redirect("/");

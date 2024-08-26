import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import Attendance from "~/models/Attendance";

export const action: ActionFunction = async ({ request }) => {
  const payload = await request.json();
  const currentTime = new Date();
  const threeHoursInMilliseconds = 3 * 60 * 60 * 1000;

  console.log("take-attendance.ts: currentTime", currentTime);

  // Check for existing attendance record for the user
  const existingRecord = await Attendance.findOne({
    user: payload.user,
    checkInTime: {
      $gte: new Date(
        currentTime.getFullYear(),
        currentTime.getMonth(),
        currentTime.getDate()
      ),
    },
  });

  if (existingRecord) {
    // Check if checkout time is already recorded
    if (existingRecord.checkOutTime) {
      return { error: "User has already signed out for today." };
    }

    // Update the existing record with checkout time
    await Attendance.findByIdAndUpdate(existingRecord._id, {
      checkOutTime: currentTime,
    });
  } else {
    // Validate check-in time (within 3 hours of the current time)
    // if (
    //   currentTime.getTime() - new Date().getTime() >
    //   threeHoursInMilliseconds
    // ) {
    //   return {
    //     error: "Check-in time must be within 3 hours of the current time.",
    //   };
    // }

    // Create a new attendance record
    await Attendance.create({
      user: payload.user,
      checkInTime: currentTime,
    });
  }

  return redirect("/");
};

export const loader = async () => redirect("/");

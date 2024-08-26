import { Schema } from "mongoose";
import mongoose from "~/utils/mongoose";
import { AttendanceInterface } from "~/utils/types";

const schema = new Schema<AttendanceInterface>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    checkInTime: {
      type: Schema.Types.Date,
      default: Date.now,
    },
    checkOutTime: {
      type: Schema.Types.Date,
    },
  },
  {
    timestamps: true,
  }
);

let Attendance: mongoose.Model<AttendanceInterface>;
try {
  Attendance = mongoose.model<AttendanceInterface>("attendance");
} catch (error) {
  Attendance = mongoose.model<AttendanceInterface>("attendance", schema);
}

export default Attendance;

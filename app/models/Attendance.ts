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

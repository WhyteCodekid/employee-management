import { Schema } from "mongoose";
import mongoose from "~/utils/mongoose";
import { LeaveInterface } from "~/utils/types";

const schema = new Schema<LeaveInterface>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    type: {
      type: String,
      enum: ["annual", "sick", "unpaid"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

let Leave: mongoose.Model<LeaveInterface>;
try {
  Leave = mongoose.model<LeaveInterface>("leaves");
} catch (error) {
  Leave = mongoose.model<LeaveInterface>("leaves", schema);
}

export default Leave;

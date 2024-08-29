import { Schema } from "mongoose";
import mongoose from "~/utils/mongoose";
import { JobInterface } from "~/utils/types";

const schema = new Schema<JobInterface>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    commitment: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship"],
    },
    salary: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

let Job: mongoose.Model<JobInterface>;
try {
  Job = mongoose.model<JobInterface>("jobs");
} catch (error) {
  Job = mongoose.model<JobInterface>("jobs", schema);
}

export default Job;

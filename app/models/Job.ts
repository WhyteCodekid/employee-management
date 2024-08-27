import { Schema } from "mongoose";
import mongoose from "~/utils/mongoose";
import { JobInterface } from "~/utils/types";

const schema = new Schema<JobInterface>(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
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

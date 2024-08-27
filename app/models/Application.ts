import { Schema } from "mongoose";
import mongoose from "~/utils/mongoose";
import { ApplicationInterface } from "~/utils/types";

const schema = new Schema<ApplicationInterface>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    emailName: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    resume: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

let Application: mongoose.Model<ApplicationInterface>;
try {
  Application = mongoose.model<ApplicationInterface>("applications");
} catch (error) {
  Application = mongoose.model<ApplicationInterface>("applications", schema);
}

export default Application;

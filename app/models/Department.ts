import { Schema } from "mongoose";
import mongoose from "~/mongoose";
import { DepartmentInterface } from "~/utils/types";

const schema = new Schema<DepartmentInterface>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "departments",
      required: false,
    },
    description: {
      type: String,
    },
    manager: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    supervisors: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: false,
      },
    ],
    isParent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

let Department: mongoose.Model<DepartmentInterface>;
try {
  Department = mongoose.model<DepartmentInterface>("departments");
} catch (error) {
  Department = mongoose.model<DepartmentInterface>("departments", schema);
}

export default Department;

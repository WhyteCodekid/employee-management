import { Schema } from "mongoose";
import mongoose from "~/utils/mongoose";
import { UserInterface } from "~/utils/types";
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const phoneRegex = /^[0-9]{11}$/; // Example regex for phone numbers (adjust as needed)

const userSchema = new Schema<UserInterface>(
  {
    firstName: String,
    lastName: String,
    email: {
      type: String,
      required: false,
      unique: false,
      // match: [emailRegex, "Invalid email format"],
    },
    password: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: [
        "admin",
        "staff",
        "manager",
        "supervisor",
        "nurse",
        "doctor",
        "lab-technician",
        "general-manager",
      ],
      default: "staff",
    },
    position: {
      type: String,
    },
    staffId: {
      type: String,
      required: true,
      unique: false,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "departments",
      required: false,
    },
    phone: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: false,
    },
    employeeStatus: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    image: {
      type: String,
    },
    baseSalary: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

let User: mongoose.Model<UserInterface>;
try {
  User = mongoose.model<UserInterface>("users");
} catch (error) {
  User = mongoose.model<UserInterface>("users", userSchema);
}

export default User;

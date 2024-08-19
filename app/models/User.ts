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
    permissions: [
      {
        type: String,
      },
    ],
    generalManager: {
      type: Boolean,
      default: false,
    },
    contractor: {
      type: String,
    },
    employeeStatus: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// // Custom validation function to check uniqueness excluding the current user
// async function isUnique(value, field, userId) {
//   const query = { [field]: value };
//   if (userId) {
//     query._id = { $ne: userId };
//   }
//   const count = await mongoose.models.users.countDocuments(query);
//   return count === 0;
// }

// userSchema.pre("save", async function (next) {
//   const user = this;
//   const isNew = user.isNew;

//   const checks = [
//     { field: "email", value: user.email },
//     { field: "phone", value: user.phone },
//     { field: "staffId", value: user.staffId },
//   ];

//   for (const check of checks) {
//     if (
//       check.value &&
//       !(await isUnique(check.value, check.field, isNew ? null : user._id))
//     ) {
//       return next(new Error(`${check.field} must be unique`));
//     }
//   }

//   next();
// });

// userSchema.pre("findOneAndUpdate", async function (next) {
//   const update = this.getUpdate();
//   const userId = this.getQuery()._id;

//   const checks = [
//     { field: "email", value: update.email },
//     { field: "phone", value: update.phone },
//     { field: "staffId", value: update.staffId },
//   ];

//   for (const check of checks) {
//     if (check.value && !(await isUnique(check.value, check.field, userId))) {
//       return next(new Error(`${check.field} must be unique`));
//     }
//   }

//   next();
// });

let User: mongoose.Model<UserInterface>;
try {
  User = mongoose.model<UserInterface>("users");
} catch (error) {
  User = mongoose.model<UserInterface>("users", userSchema);
}

export default User;

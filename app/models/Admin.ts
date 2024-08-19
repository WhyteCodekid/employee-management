import bcrypt from "bcryptjs";
import mongoose from "~/utils/mongoose";

const schema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    middleName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: {
      type: String,
      required: true,
    },
    // role: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "roles",
    //   required: false,
    // },
    phone: {
      type: String,
      unique: true,
    },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "permissions",
      },
    ],
  },
  { timestamps: true }
);

// // Password hashing middleware
// AdminSchema.pre("save", function (next) {
//   if (!this.isModified("password")) return next();
//   bcrypt.hash(this.password as string, 10, (err, hash) => {
//     if (err) return next(err);
//     this.password = hash;
//     next();
//   });
// });

// // Password verification method
// AdminSchema.methods.comparePassword = function (candidatePassword, callback) {
//   bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
//     if (err) return callback(err);
//     callback(null, isMatch);
//   });
// };

let Admin: mongoose.Model<AdminInterface>;
try {
  Admin = mongoose.model<AdminInterface>("admins");
} catch (error) {
  Admin = mongoose.model<AdminInterface>("admins", schema);
}

export default Admin;

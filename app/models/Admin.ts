import bcrypt from "bcryptjs";
import mongoose from "~/utils/mongoose";

// TODO: Merge all profiles into one (Employees, Admins, Users)
const AdminSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    middleName: String,
    lastName: String,
    email: { type: String, unique: true },
    username: String,
    password: String,
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "roles",
      required: false,
    },
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
    clientConnection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clientConnections",
    },
  },
  { timestamps: true }
);

// Password hashing middleware
AdminSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  bcrypt.hash(this.password as string, 10, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  });
});

// Password verification method
AdminSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

export default AdminSchema;

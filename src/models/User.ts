import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/user";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: { type: String },
    skills: [String],
    profileImage: { type: String, default: null },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    passwordResetToken: { type: String, default: undefined },
    passwordResetExpires: { type: Date, default: undefined },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(this.password, salt);

    this.password = hashed;
    next();
  } catch (err) {
    const error = err as Error;
    next(error);
  }
});

userSchema.methods.comparePassword = function (plainPassword: string) {
  return bcrypt.compare(plainPassword, this.password);
};

userSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // * expires in 10 mins

  return resetToken; // * raw token to send via email
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;

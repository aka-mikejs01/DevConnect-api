import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  bio?: string;
  skills?: string[];
  profileImage?: string | null;
  role: "user" | "admin";
  _id: Types.ObjectId;
  comparePassword: (plainPassword: string) => Promise<Boolean>;
  passwordResetToken: string | undefined;
  passwordResetExpires: Date | undefined;
  createPasswordResetToken(): string;
}

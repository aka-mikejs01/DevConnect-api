import { Response } from "express";
import User from "../models/User";
import logger from "../middleware/logger";
import { matchedData } from "express-validator";
import { AuthRequest } from "../types/authRequest";

export const getProfile = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: "Error Occured", error: error.message });
    logger.error(error.message);
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const { name, email, bio, skills } = matchedData(req);

    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (bio) user.bio = bio;
    if (skills) user.skills = skills;

    await user.save();

    logger.info(`User ${user.email} updated profile`);

    return res.json({
      message: "Profile updated",
      name: user.name,
      email: user.email,
      bio: user.bio,
      skills: user.skills,
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: "Error Occured", error: error.message });
    logger.error(error.message);
  }
};

export const changePassword = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const { oldPassword, newPassword } = matchedData(req);

    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch)
      return res.status(403).json({ message: "Old password is incorrect" });

    user.password = newPassword;

    await user.save();

    logger.info(`User ${user.email} changed their password`);

    return res.json({ message: "Password changed successfully" });
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    res.status(500).json({ message: "Error Occured", error: error.message });
  }
};

export const deleteAccount = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await user.deleteOne();

    logger.info(`User ${user.email} deleted their account`);

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    res.status(500).json({ message: "Error occurred", error: error.message });
  }
};

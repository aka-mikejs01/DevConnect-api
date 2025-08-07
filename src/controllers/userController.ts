import { Request, Response } from "express";
import User from "../models/User";
import logger from "../middleware/logger";
import { matchedData } from "express-validator";

interface AuthRequest extends Request {
  userId?: string;
}

export const getProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: "Error Occured", error: error.message });
    logger.error(error.message);
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, email, bio, skills } = matchedData(req);

    const user = await User.findById(req.userId);
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (bio) user.bio = bio;
    if (skills) user.skills = skills;

    await user.save();

    logger.info(`User ${user.name} updated profile`);

    res.json({
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

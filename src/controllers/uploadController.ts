import { Request, Response } from "express";
import User from "../models/User";
import logger from "../middleware/logger";

interface AuthRequest extends Request {
  userId?: string;
}

export const uploadProfileImage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const userId = req.userId;

    const profileUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: profileUrl },
      { new: true }
    );

    logger.info(`User ${userId} set profile`);

    res.status(200).json({
      message: "Profile image uploaded successfully",
      profileImage: updatedUser?.profileImage,
    });
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
      res.status(500).json({ message: "Error Occured", error: err.message });
      return;
    }
  }
};

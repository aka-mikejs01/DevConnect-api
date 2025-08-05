import User from "../models/User";
import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { getAccessToken, getRefreshToken } from "../utils/generateToken";
import { RegisterBody, LoginBody } from "../types/body";
import logger from "../middleware/logger";
import { RequestWithCookies } from "../types/cookies";
import jwt from "jsonwebtoken";

export const registerUser = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = matchedData(req) as RegisterBody;

    const exist = await User.findOne({ email });
    if (exist) {
      logger.warn("Someone tried to register with existing email");
      res.status(400).json({ message: "Email already in use" });
      return;
    }

    const user = new User({ name, email, password });
    await user.save();

    logger.info(`New user registered: ${user.name}`);

    const accessToken = getAccessToken(user._id.toString());
    const refreshToken = getRefreshToken(user._id.toString());

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({ message: "Registered successfully", accessToken });
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
      res.status(500).json({ message: "Error Occured", error: err.message });
    }
  }
};

export const loginUser = async (
  req: Request<{}, {}, LoginBody>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = matchedData(req) as LoginBody;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid Credentials" });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid Credentials" });
      return;
    }

    logger.info(`New user logged in: ${user.name}`);

    const accessToken = getAccessToken(user._id.toString());
    const refreshToken = getRefreshToken(user._id.toString());

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: "Login successfully", accessToken });
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
      res.status(500).json({ message: "Error Occured", error: err.message });
    }
  }
};

export const logoutUser = (_req: Request, res: Response): void => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.json({ message: "Logout successfull" });
};

export const refresh = (req: RequestWithCookies, res: Response): void => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    res.status(403).json({ message: "No token provided" });
    return;
  }

  jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET!,
    (err, decoded: any): void => {
      if (err) {
        res.status(403).json({ message: "Invalid Token" });
        return;
      }
      const accessToken = getAccessToken(decoded.id);

      res.json({ accessToken });
    }
  );
};

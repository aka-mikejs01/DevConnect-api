import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/authRequest";

export const isAuthenticated = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers?.authorization;
  if (!authHeader || !authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token!, process.env.ACCESS_TOKEN_SECRET!) as {
      userId: string;
    };

    req.userId = decoded.userId;

    next();
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === "TokenExpiredError") {
        res.status(403).json({ message: "Token Expired" });
        return;
      } else {
        res.status(403).json({ message: "Invalid token" });
      }
    } else {
      res.status(403).json({ message: "Unknown Error" });
    }
  }
};

import { Request, Response, NextFunction } from "express";
import { checkSchema, Schema, validationResult } from "express-validator";

const changePasswordSchema: Schema = {
  oldPassword: {
    in: ["body"],
    exists: {
      errorMessage: "Old password is required",
    },
    isString: {
      errorMessage: "Old password must be a string",
    },
    isLength: {
      options: { min: 6 },
      errorMessage: "Old password must be at least 6 characters",
    },
  },
  newPassword: {
    in: ["body"],
    exists: {
      errorMessage: "New password is required",
    },
    isString: {
      errorMessage: "New password must be a string",
    },
    isLength: {
      options: { min: 6 },
      errorMessage: "New password must be at least 6 characters",
    },
  },
};

export const changePasswordValidator = [
  checkSchema(changePasswordSchema),
  (req: Request, res: Response, next: NextFunction): void => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      res.status(400).json({ error: error.array() });
      return;
    }

    next();
  },
];

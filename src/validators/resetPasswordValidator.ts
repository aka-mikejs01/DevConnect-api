import { Request, Response, NextFunction } from "express";
import { checkSchema, validationResult, Schema } from "express-validator";

const resetPasswordSchema: Schema = {
  newPassword: {
    in: ["body"],
    isString: true,
    isLength: {
      options: { min: 6 },
      errorMessage: "New password must be at least 6 characters",
    },
  },
};

export const resetPasswordValidator = [
  checkSchema(resetPasswordSchema),
  (req: Request, res: Response, next: NextFunction): Response | void => {
    const error = validationResult(req);
    if (!error.isEmpty()) return res.status(400).json({ error: error.array() });

    next();
  },
];

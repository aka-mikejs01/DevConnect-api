import { Request, Response, NextFunction } from "express";
import { checkSchema, validationResult, Schema } from "express-validator";

const registerSchema: Schema = {
  name: {
    isString: true,
    notEmpty: true,
    errorMessage: "Name is required",
  },
  email: {
    isEmail: true,
    normalizeEmail: true,
    errorMessage: "Valid email required",
  },
  password: {
    isLength: {
      options: { min: 6 },
    },
    errorMessage: "Password must be at least 6 characters",
  },
};

const loginSchema: Schema = {
  email: {
    isEmail: true,
    errorMessage: "Valid email required",
  },
  password: {
    notEmpty: true,
    errorMessage: "Password is required",
  },
};

const forgotPasswordSchema: Schema = {
  email: {
    in: ["body"],
    isEmail: {
      errorMessage: "Provide a valid email",
    },
    normalizeEmail: true,
  },
};

export const registerValidator = [
  checkSchema(registerSchema),
  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  },
];

export const loginValidator = [
  checkSchema(loginSchema),
  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  },
];

export const forgotPasswordValidator = [
  checkSchema(forgotPasswordSchema),
  (req: Request, res: Response, next: NextFunction): Response | void => {
    const error = validationResult(req);
    if (!error.isEmpty()) return res.status(400).json({ error: error.array() });

    next();
  },
];

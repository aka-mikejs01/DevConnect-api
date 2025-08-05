import { RequestHandler } from "express";
import { checkSchema, validationResult, Schema } from "express-validator";

type Middleware = RequestHandler | RequestHandler[];

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

export const registerValidator: Middleware[] = [
  ...checkSchema(registerSchema),
  (req, res, next): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  },
];

export const loginValidator: Middleware[] = [
  ...checkSchema(loginSchema),
  (req, res, next): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  },
];

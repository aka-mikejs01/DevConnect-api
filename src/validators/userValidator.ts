import { Request, Response, NextFunction } from "express";
import { checkSchema, validationResult, Schema } from "express-validator";

const updateProfileSchema: Schema = {
  name: {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "Name must be a string",
    },
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: "Name must be between 2 and 50 characters",
    },
  },
  email: {
    in: ["body"],
    optional: true,
    isEmail: {
      errorMessage: "Email must be valid",
    },
    normalizeEmail: true,
  },
  bio: {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "Bio must be a string",
    },
    isLength: {
      options: { max: 500 },
      errorMessage: "Bio must not exceed 500 characters",
    },
  },
  skills: {
    in: ["body"],
    optional: true,
    isArray: {
      errorMessage: "Skills must be an array",
    },
    custom: {
      options: (skills) =>
        Array.isArray(skills) && skills.every((s) => typeof s === "string"),
      errorMessage: "All skills must be strings",
    },
  },
};

export const updateProfileValidator = [
  checkSchema(updateProfileSchema),
  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() }); // 400 instead of 404 for validation errors
      return;
    }
    next();
  },
];

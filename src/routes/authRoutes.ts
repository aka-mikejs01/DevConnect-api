import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refresh,
  forgotPassword,
} from "../controllers/authContoller";
import { registerValidator, loginValidator } from "../validators/authValidator";
import { forgotPasswordValidator } from "../validators/authValidator";

const router = Router();

router.post("/register", ...registerValidator, registerUser);
router.post("/login", ...loginValidator, loginUser);
router.post("/logout", logoutUser);
router.post("/refresh", refresh);
router.post("/forgot-password", ...forgotPasswordValidator, forgotPassword);

export default router;

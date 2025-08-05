import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refresh,
} from "../controllers/authContoller";
import { registerValidator, loginValidator } from "../validators/authValidator";

const router = Router();

router.post("/register", ...registerValidator, registerUser);
router.post("/login", ...loginValidator, loginUser);
router.post("/logout", logoutUser);
router.post("/refresh", refresh);

export default router;

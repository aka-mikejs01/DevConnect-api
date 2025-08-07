import { Router } from "express";
import { resetPassword } from "../controllers/resetPassword";
import { resetPasswordValidator } from "../validators/resetPasswordValidator";

const router = Router();

router.post("/reset-password/:token", ...resetPasswordValidator, resetPassword);

export default router;

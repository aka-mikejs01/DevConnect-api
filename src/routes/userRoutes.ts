import { Router } from "express";
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} from "../controllers/userController";
import { isAuthenticated } from "../middleware/authMiddleware";
import { updateProfileValidator } from "../validators/userValidator";
import { changePasswordValidator } from "../validators/changePasswordValidator";

const router = Router();

router.get("/profile", isAuthenticated, getProfile);
router.patch(
  "/profile",
  isAuthenticated,
  ...updateProfileValidator,
  updateProfile
);
router.patch(
  "/change-password",
  isAuthenticated,
  ...changePasswordValidator,
  changePassword
);
router.delete("/delete-account", isAuthenticated, deleteAccount);

export default router;

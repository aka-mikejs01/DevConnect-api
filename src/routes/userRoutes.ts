import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/userController";
import { isAuthenticated } from "../middleware/authMiddleware";
import { updateProfileValidator } from "../validators/userValidator";

const router = Router();

router.get("/profile", isAuthenticated, getProfile);
router.patch(
  "/profile",
  isAuthenticated,
  ...updateProfileValidator,
  updateProfile
);

export default router;

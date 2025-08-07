import { Router } from "express";
import { upload } from "../middleware/upload";
import { isAuthenticated } from "../middleware/authMiddleware";
import { uploadProfileImage } from "../controllers/uploadController";

const router = Router();

router.post(
  "/upload",
  isAuthenticated,
  upload.single("profile"),
  uploadProfileImage
);

export default router;

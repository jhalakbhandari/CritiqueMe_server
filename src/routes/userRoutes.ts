import { Router } from "express";
import {
  getProfilePictureHandler,
  handleUserSignup,
  uploadProfilePictureHandler,
} from "../controllers/userController";
import multer from "multer";

const router = Router();
const upload = multer();

router.post("/signup", handleUserSignup);

//user profile properties update like phone number, email, password, profile picture, theme)

//pf get and upload
router.post(
  "/:id/profile-picture",
  upload.single("profilePic"),
  uploadProfilePictureHandler
);

router.get("/:id/profile-picture", getProfilePictureHandler);

export default router;

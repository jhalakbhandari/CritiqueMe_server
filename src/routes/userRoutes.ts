import { Router } from "express";
import {
  checkFollowStatusController,
  getProfilePictureHandler,
  getUserProfile,
  handleUserSignup,
  handleUserUpdate,
  searchUsersController,
  toggleFollowController,
  uploadProfilePictureHandler,
} from "../controllers/userController";
import multer from "multer";

const router = Router();
const upload = multer();

router.post("/signup", handleUserSignup);
router.post("/user-update", handleUserUpdate);

//user profile properties update like phone number, email, password, profile picture, theme)

//pf get and upload
router.post(
  "/:id/profile-picture",
  upload.single("file"),
  uploadProfilePictureHandler
);

router.get("/:id/profile-picture", getProfilePictureHandler);
router.get("/search", searchUsersController);
router.get("/profile/:id", getUserProfile);
router.post("/follow/:id", toggleFollowController);
router.get("/follow-status/:targetUserId", checkFollowStatusController);

export default router;

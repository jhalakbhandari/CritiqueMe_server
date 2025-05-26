import { Router } from "express";
import { handleUserSignup } from "../controllers/userController";

const router = Router();

router.post("/signup", handleUserSignup);

//user profile properties update like phone number, email, password, profile picture, theme)

export default router;

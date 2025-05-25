import { Router } from "express";
import { handleUserSignup } from "../controllers/userController";

const router = Router();

router.post("/signup", handleUserSignup);

export default router;

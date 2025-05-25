// routes/authRoutes.ts
import express, { Request, Response } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { handleGoogleCallback, handleLocalLogin } from "../controllers/authController";

const router = express.Router();

// Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  handleGoogleCallback
);
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  handleLocalLogin
);
export default router;

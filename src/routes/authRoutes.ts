import passport from "passport";
import bcrypt from "bcryptjs";
import express from "express";
import { prisma } from "../config/prisma";
const router = express.Router();

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json(req.user);
});
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:5173/dashboard",
    failureRedirect: "http://localhost:5173/login",
  })
);

export default router;

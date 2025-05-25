import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const handleGoogleCallback = (req: Request, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ message: "authentication failed" });
    return;
  }

  const user = req.user as { id: string; email: string };
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || "default_secret",
    { expiresIn: "1h" }
  );

  res.redirect(`${process.env.Frontend_URL}/auth/callback?token=${token}`);
};

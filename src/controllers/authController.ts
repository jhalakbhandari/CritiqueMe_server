import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const handleGoogleCallback = (req: Request, res: Response): void => {
  const user = req.user as { id: string; email: string };

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );

  // Redirect to frontend with token
  res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  // res.redirect(`${process.env.Frontend_URL}/auth/callback?token=${token}`);
};

import { Request, Response } from "express";
import { createUser } from "../services/userService";
// import { createUser } from "../services/authService";

export const handleUserSignup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res
        .status(400)
        .json({ error: "Name, email, and password are required." });
      return;
    }

    const user = await createUser({ name, email, password });

    res.status(201).json({ message: "User signed up successfully.", user });
    return;
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error." });
    return;
  }
};

import { Request, Response } from "express";
import {
  createUser,
  getProfilePictureStream,
  uploadProfilePicture,
} from "../services/userService";

// import { createUser } from "../services/authService";

//signup user
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

//user profile properties update like phone number, email, password, theme)

//upload and get profile picture
// src/controllers/userController.ts

export async function uploadProfilePictureHandler(
  req: Request,
  res: Response
): Promise<void> {
  const userId = req.params.id;
  const file = req.file;

  if (!file) {
    res.status(400).send("No file uploaded");
    return;
  }

  try {
    const fileId = await uploadProfilePicture(userId, file.buffer);
    res.json({ message: "Profile picture uploaded", fileId });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).send("Failed to upload profile picture");
  }
}

export async function getProfilePictureHandler(req: Request, res: Response) {
  const userId = req.params.id;

  try {
    const downloadStream = await getProfilePictureStream(userId);

    if (!downloadStream) {
      // fallback to default image served by frontend
      return res.redirect("/default-profile.png");
    }

    downloadStream.on("error", () => {
      res.redirect("/default-profile.png");
    });

    downloadStream.pipe(res);
  } catch (error) {
    console.error("Error streaming profile picture:", error);
    res.redirect("/default-profile.png");
  }
}

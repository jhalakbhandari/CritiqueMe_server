import { Request, Response } from "express";
import {
  checkFollowStatusService,
  createUser,
  getDraftPostsByUserIdFromDB,
  getProfilePictureStream,
  getUserProfileWithPosts,
  toggleFollowService,
  uploadProfilePicture,
} from "../services/userService";
import { searchUsersService } from "../services/postService";

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
  if (!userId) {
    return;
  }
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

export const searchUsersController = async (req: Request, res: Response) => {
  const query = req.query.q?.toString() || "";

  try {
    const users = await searchUsersService(query);
    res.status(200).json(users);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Failed to search users" });
  }
};
export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.params.id;

  try {
    const user = await getUserProfileWithPosts(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: "Failed to load profile" });
  }
};

export const toggleFollowController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const followerId = req.body.followerId;
  const followingId = req.params.id;

  if (!followerId || !followingId) {
    res.status(400).json({ error: "Missing followerId or followingId" });
    return;
  }

  try {
    const result = await toggleFollowService(followerId, followingId);
    res.json({ message: result });
  } catch (err) {
    console.error("❌ Error toggling follow:", err);
    res.status(500).json({ error: "Failed to toggle follow status" });
  }
};

export const checkFollowStatusController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const targetUserId = req.params.targetUserId;
  const currentUserId = req.query.currentUserId as string;

  if (!targetUserId || !currentUserId) {
    res.status(400).json({ error: "Missing user IDs" });
    return;
  }

  try {
    const isFollowing = await checkFollowStatusService(
      currentUserId,
      targetUserId
    );
    res.status(200).json({ isFollowing });
    return;
  } catch (error) {
    console.error("❌ Follow status error:", error);
    res.status(500).json({ error: "Server error" });
    return;
  }
};

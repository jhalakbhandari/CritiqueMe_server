import { Request, Response } from "express";
import { createPost } from "../services/postService";
import { AuthRequest } from "../types";

export const handleSubmitPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Cast req *wherever* you need .user
  const user = (req as AuthRequest).user;

  const { title, description, tags, media, status } = req.body;

  if (!title || !description || !media || !status || !user?.id) {
    res.status(400).json({
      error: "Title, description, media, userId, and status are required.",
    });
    return;
  }

  const formattedTags =
    typeof tags === "string" ? tags.split(",").map((tag) => tag.trim()) : tags;

  const userId = user.id;

  const post = await createPost({
    title,
    description,
    media,
    userId,
    status,
    tags: formattedTags || [],
  });

  res.status(201).json({
    message: "Post created successfully.",
    post,
  });
};

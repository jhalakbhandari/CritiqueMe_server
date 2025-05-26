import { Request, Response } from "express";
import {
  createPost,
  getAllPostsWithUsersFromDB,
  updateDraftPost,
} from "../services/postService";
import { AuthRequest } from "../types";
import { Prisma } from "@prisma/client";
//create post
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

//delete post

//update post(draft post will be updated only)
export const handleUpdatePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // const user = (req as AuthRequest).user;

    const { id, title, description, tags, media, status } = req.body;

    if (!id || !title || !description || !media || !status) {
      res.status(400).json({
        error: "Post ID, title, description, media, and status are required.",
      });
      return;
    }

    const formattedTags =
      typeof tags === "string"
        ? tags.split(",").map((tag) => tag.trim())
        : tags;
    // console.log(req.body);

    const updatedPost = await updateDraftPost(req.body);

    res.status(200).json({
      message: "Post updated successfully.",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({
      error: "An error occurred while updating the post.",
    });
  }
};

//get all posts to show on feed
export const getAllPostsWithUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const posts = await getAllPostsWithUsersFromDB();

    res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving posts." });
  }
};
//get posts by userId to show on user personal feed will include only submitted posts

//get posts by userId only draft posts

import { Request, Response } from "express";
import {
  createPost,
  deletePost,
  getAllPostsWithUsersFromDB,
  updateDraftPost,
} from "../services/postService";
import { AuthRequest } from "../types";
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
/**
 * Handles the deletion of a post by its ID.
 * Requires the user to be authenticated (user is attached to req).
 */
export const handleDeletePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Type cast to get user from request if using custom AuthRequest interface
  const user = (req as AuthRequest).user;

  try {
    const postId = req.params.postId;

    if (!postId) {
      res.status(400).json({ error: "Post ID is required." });
      return;
    }

    // Attempt to delete the post
    const deletedPost = await deletePost(postId);

    if (!deletedPost) {
      res.status(404).json({ error: "Post not found." });
      return;
    }

    // Respond with success and deleted post details
    res.status(200).json({
      message: "Post deleted successfully.",
      deletedPost,
    });

  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({
      error: "An error occurred while deleting the post.",
    });
  }
};

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

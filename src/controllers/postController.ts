import { Request, Response } from "express";
import {
  createPost,
  deletePost,
  fetchPostsByUser,
  getAllPostsWithUsersFromDB,
  handleCommentOnPosts,
  handleGetCommentsOnPost,
  handleLikePosts,
  updateDraftPost,
} from "../services/postService";
import { AuthRequest } from "../types";
import { getDraftPostsByUserIdFromDB } from "../services/userService";
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
    const userId = req.query.userId as string;
    const posts = await getAllPostsWithUsersFromDB(userId);

    res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving posts." });
  }
};

//get posts by userId to show on user personal feed will include only submitted posts
export const getAllSubmittedPostsByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      res.status(400).json({ error: "User ID is required." });
      return;
    }

    // Attempt to fetch the public posts by user ID
    const fetchedPosts = await fetchPostsByUser(userId);

    if (!fetchedPosts) {
      res
        .status(404)
        .json({ error: "No submitted posts found for this user." });
      return;
    }

    // Respond with success and fetched public post details
    res.status(200).json({
      message: "Submitted Posts fetched successfully.",
      fetchedPosts,
    });
  } catch (error) {
    console.error("Error fetching submitted posts:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving submitted posts." });
  }
};

// //get posts by userId only draft posts
// export const getAllDraftPostsByUserId = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const userId = req.params.userId;

//     if (!userId) {
//       res.status(400).json({ error: "User ID is required." });
//       return;
//     }

//     // Attempt to fetch the draft posts by user ID
//     const fetchedDraftsPosts = await fetchDraftPostsByUser(userId);

//     if (!fetchedDraftsPosts) {
//       res.status(404).json({ error: "No draft posts found for this user." });
//       return;
//     }

// Respond with success and fetched draft post details
//     res.status(200).json({
//       message: "Draft Posts fetched successfully.",
//       fetchedDraftsPosts,
//     });
//   } catch (error) {
//     console.error("Error fetching draft posts:", error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while retrieving draft posts." });
//   }
// };

export const handleLikePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.body.userId;
    const postId = req.params.id;

    if (!userId || !postId) {
      res.status(400).json({ error: "User ID and Post ID are required." });
      return;
    }

    const result = await handleLikePosts(userId, postId);

    res.status(200).json({
      message: result.liked ? "Post liked." : "Post unliked.",
      ...result,
    });
  } catch (error) {
    console.error("Error liking/unliking post:", error);
    res.status(500).json({ error: "Something went wrong while liking post." });
  }
};
export const handleCommentOnPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { text, userId } = req.body;
    const postId = req.params.id;

    if (!userId || !postId || !text) {
      res
        .status(400)
        .json({ error: "User ID, Post ID, and comment text are required." });
      return;
    }

    // Correct order: userId, postId, text
    const result = await handleCommentOnPosts(userId, postId, text);

    res.status(200).json({
      message: "Comment added successfully.",
      ...result,
    });
  } catch (error) {
    console.error("Error commenting on post:", error);
    res
      .status(500)
      .json({ error: "Something went wrong while commenting on post." });
  }
};

/**
 * Fetches all comments on a specific post.
 *
 * @param req - Express request containing the post ID in params
 * @param res - Express response returning the list of comments
 */
export const handleGetCommentsOnPosts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { postId } = req.params;
    // console.log("id", postId);

    if (!postId) {
      res.status(400).json({ error: "Post ID is required." });
      return;
    }

    const comments = await handleGetCommentsOnPost(postId);
    res.status(200).json({
      message: "Comments fetched successfully.",
      comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res
      .status(500)
      .json({ error: "Something went wrong while fetching comments." });
  }
};

export const getDraftPostsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const posts = await getDraftPostsByUserIdFromDB(userId);
    res.json(posts);
  } catch (error) {
    console.error("Error fetching draft posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

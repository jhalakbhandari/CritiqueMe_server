// Importing the initialized Prisma client instance from the config folder
import { prisma } from "../config/prisma";
import { UpdatePostInput } from "../types";

// Define the structure of a Post object using a TypeScript interface
interface Post {
  title: string;
  description: string;
  tags: string[]; // Array of tags associated with the post
  media: string; // URL or reference to media content (image/video)
  userId: string; // ID of the user who created the post
  status: string; // Status of the post (e.g., 'published', 'draft')
}

// Asynchronous function to create a new post in the database
export const createPost = async (postData: Post) => {
  // Destructure the post data for ease of use
  const { title, description, tags, media, userId, status } = postData;

  // Create and insert a new post record into the database using Prisma
  const newPost = await prisma.post.create({
    data: {
      title,
      description,
      tags,
      media,
      userId,
      status,
    },
  });

  // Return the newly created post
  return newPost;
};

export const updateDraftPost = async (postData: UpdatePostInput) => {
  const { id, title, description, tags, media, status } = postData;
  const updatedPost = await prisma.post.update({
    where: { id },
    data: {
      title,
      description,
      tags,
      media,
      status,
    },
  });

  return updatedPost;
};

/**
 * Deletes a post by its ID from the database.
 *
 * @param postId - The ID of the post to delete
 * @returns The deleted post data if successful, otherwise throws an error
 */
export const deletePost = async (postId: string) => {
  try {
    const deletedPost = await prisma.post.delete({
      where: { id: postId },
    });
    return deletedPost;
  } catch (error) {
    console.error("Failed to delete post:", error);
    throw error; // Let the caller handle the error
  }
};

// This just fetches the data from the database and returns it
export const getAllPostsWithUsersFromDB = async () => {
  const posts = await prisma.post.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return posts;
};

/**
 * Fetches all submitted posts created by a specific user.
 *
 * @param userId - The ID of the user whose posts need to be fetched
 * @returns An array of posts belonging to the given user
 */
export const fetchPostsByUser = async (userId: string) => {
  // Query the database to find all posts where the userId matches the provided one and status is public (submitted posts only)
  const posts = await prisma.post.findMany({
    where: {
      userId: userId,
      status: "public",
    },
  });

  // Return the submitted fetched posts
  return posts;
};

/**
 * Fetches all draft posts created by a specific user.
 *
 * @param userId - The ID of the user whose draft posts need to be fetched
 * @returns An array of posts belonging to the given user
 */
export const fetchDraftPostsByUser = async (userId: string) => {
  // Query the database to find all posts where the userId matches the provided one and status is private (draft posts only)
  const posts = await prisma.post.findMany({
    where: {
      userId: userId,
      status: "private",
    },
  });

  // Return the draft fetched posts
  return posts;
};

export const handleLikePosts = async (userId: string, postId: string) => {
  // Check if the like already exists
  const existing = await prisma.like.findFirst({
    where: {
      postId,
      userId,
    },
  });

  if (existing) {
    // If exists, remove the like (unlike)
    await prisma.like.delete({
      where: {
        id: existing.id,
      },
    });

    return { liked: false };
  }

  // If not, create a like
  await prisma.like.create({
    data: {
      postId,
      userId,
    },
  });

  return { liked: true };
};

export const handleCommentOnPosts = async (
  userId: string,
  postId: string,
  text: string
) => {
  // Create a new comment
  const comment = await prisma.comment.create({
    data: {
      text,
      postId,
      userId: userId,
    },
  });

  return { success: true, comment };
};
/**
 * Fetches all comments on a specific post.
 *
 * @param postId - ID of the post to fetch comments for
 * @returns An object containing a success flag and an array of comments
 */
export const handleGetCommentsOnPost = async (postId: string) => {
  const comments = await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "asc" },
    include: {
      user: {
        select: { name: true, id: true }, // Adjust field name if needed
      },
    },
  });

  return { success: true, comments };
};

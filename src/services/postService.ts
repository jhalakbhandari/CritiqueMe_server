// Importing the initialized Prisma client instance from the config folder
import { prisma } from "../config/prisma";
import { UpdatePostInput } from "../types";

// Define the structure of a Post object using a TypeScript interface
interface Post {
  title: string;
  description: string;
  tags: string[];      // Array of tags associated with the post
  media: string;       // URL or reference to media content (image/video)
  userId: string;      // ID of the user who created the post
  status: string;      // Status of the post (e.g., 'published', 'draft')
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
  // console.log(postData);
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

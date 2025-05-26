// Importing the initialized Prisma client instance from the config folder
import { prisma } from "../config/prisma";

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

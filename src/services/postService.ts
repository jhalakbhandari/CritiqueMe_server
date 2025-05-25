import { prisma } from "../config/prisma";

interface Post {
  title: string;
  description: string;
  tags: string[];
  media: string;
  userId: string;
  status: string;
}

export const createPost = async (postData: Post) => {
  const { title, description, tags, media, userId, status } = postData;

  // Create post in the database
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

  return newPost;
};

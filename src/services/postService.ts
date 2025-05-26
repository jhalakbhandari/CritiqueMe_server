import { prisma } from "../config/prisma";
import { UpdatePostInput } from "../types";

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

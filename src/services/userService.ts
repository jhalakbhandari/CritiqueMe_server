import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";
import { ObjectId } from "mongodb";
import { connectMongo } from "../config/mongo";
import type { GridFSFile } from "mongodb";

interface User {
  name: string;
  email: string;
  password: string;
}

export const createUser = async (userData: User) => {
  const { name, email, password } = userData;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User with this email already exists.");
  }

  // Hash password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user in the database
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "user",
    },
  });

  // Omit password in response
  const { password: _, ...userWithoutPassword } = newUser;

  return userWithoutPassword;
};

export const updateUser = async (userData: User) => {
  const { name, email, password } = userData;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User with this email already exists.");
  }

  // Hash password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user in the database
  const newUser = await prisma.user.update({
    where:{email},
    data: {
      name,
      // email,
      password: hashedPassword,
      role: "user",
    },
  });

  // Omit password in response
  const { password: _, ...userWithoutPassword } = newUser;

  return userWithoutPassword;
};
//upload and get profile picture
export async function uploadProfilePicture(userId: string, fileBuffer: Buffer) {
  const { bucket } = await connectMongo();

  return new Promise<string>((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(userId);
    uploadStream.end(fileBuffer);

    uploadStream.on("finish", async () => {
      try {
        const fileId = uploadStream.id?.toString(); // ✅ use stream id
        if (!fileId) throw new Error("Upload failed: file ID not found");

        // Fetch user first to check for old image
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (user?.profilePictureId) {
          try {
            await bucket.delete(new ObjectId(user.profilePictureId));
            // console.log("Deleted old profile picture:", user.profilePictureId);
          } catch (e) {
            console.warn("Failed to delete old profile picture:", e);
            // Not fatal — we continue
          }
        }

        // Now update with new file ID
        await prisma.user.update({
          where: { id: userId },
          data: { profilePictureId: fileId },
        });

        resolve(fileId);
      } catch (error) {
        // delete if fileId exists
        if (uploadStream.id) {
          await bucket.delete(uploadStream.id);
        }
        reject(error);
      }
    });

    uploadStream.on("error", (err) => {
      reject(err);
    });
  });
}

export async function getProfilePictureStream(userId: string) {
  if (!userId || userId === "undefined") {
    return null;
  }
  const { bucket } = await connectMongo();
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || !user.profilePictureId) {
    return null;
  }

  try {
    const fileId = new ObjectId(user.profilePictureId);

    return bucket.openDownloadStream(fileId);
  } catch {
    return null;
  }
}
export const getUserProfileWithPosts = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
      },
      followers: true,
      following: true,
    },
  });

  return user;
};

export const toggleFollowService = async (
  followerId: string,
  followingId: string
) => {
  const existingFollow = await prisma.follows.findFirst({
    where: { followerId, followingId },
  });

  if (existingFollow) {
    await prisma.follows.delete({ where: { id: existingFollow.id } });
    return "Unfollowed";
  } else {
    await prisma.follows.create({
      data: { followerId, followingId },
    });
    return "Followed";
  }
};

export const checkFollowStatusService = async (
  currentUserId: string,
  targetUserId: string
): Promise<boolean> => {
  const follow = await prisma.follows.findFirst({
    where: {
      followerId: currentUserId,
      followingId: targetUserId,
    },
  });

  return !!follow;
};

export const getDraftPostsByUserIdFromDB = async (userId: string) => {
  const posts = await prisma.post.findMany({
    where: {
      userId,
      status: "private",
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Add "status: private" to each draft post
  return posts;
};

// src/services/cleanupService.ts
import { prisma } from "../config/prisma";
export const cleanupOrphanedData = async () => {
  try {
    // 1. Delete comments with no user
    const deletedOrphanComments = await prisma.comment.deleteMany({
      where: {
        user: {
          is: null,
        },
      },
    });

    // 2. Delete comments of posts whose user is missing
    const deletedPostComments = await prisma.comment.deleteMany({
      where: {
        post: {
          user: {
            is: null,
          },
        },
      },
    });

    // 3. Delete posts with no user
    const deletedPosts = await prisma.post.deleteMany({
      where: {
        user: {
          is: null,
        },
      },
    });

    console.log(
      `🧹 Deleted ${deletedOrphanComments.count} comments with no user`
    );
    console.log(
      `🧹 Deleted ${deletedPostComments.count} comments of orphaned posts`
    );
    console.log(`🧹 Deleted ${deletedPosts.count} posts with no user`);
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
  } finally {
    await prisma.$disconnect();
  }
};

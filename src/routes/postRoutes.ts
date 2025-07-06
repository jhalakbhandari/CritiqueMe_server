import { Router } from "express";
// import { handleUserSignup } from "../controllers/userController";
import {
  // getAllDraftPostsByUserId,
  getAllPostsWithUsers,
  getAllSubmittedPostsByUserId,
  getDraftPostsByUserId,
  handleCommentOnPost,
  handleDeletePost,
  handleGetCommentsOnPosts,
  handleLikePost,
  handleSubmitPost,
  handleUpdatePost,
} from "../controllers/postController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = Router();

//post posts
router.post("/", isAuthenticated, handleSubmitPost);

//delete post
router.delete("/:postId", isAuthenticated, handleDeletePost);

//update post(draft post will be updated only)
router.put("/:postId", isAuthenticated, handleUpdatePost);
//get all posts to show on feed
router.get("/", isAuthenticated, getAllPostsWithUsers);

//get posts by userId to show on user personal feed will include only submitted posts
router.get("/submitted/:userId", isAuthenticated, getAllSubmittedPostsByUserId);

//get posts by userId only draft posts
// router.get("/draft/:userId", isAuthenticated, getAllDraftPostsByUserId);

router.post("/:id/like", handleLikePost);
// POST /api/posts/:id/comment
router.post("/:id/comment", handleCommentOnPost);
router.get("/:postId/comments", handleGetCommentsOnPosts);
router.get("/drafts/:userId", getDraftPostsByUserId);

export default router;

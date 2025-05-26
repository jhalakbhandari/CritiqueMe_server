import { Router } from "express";
// import { handleUserSignup } from "../controllers/userController";
import {
  getAllPostsWithUsers,
  handleSubmitPost,
  handleUpdatePost,
} from "../controllers/postController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = Router();

//post posts
router.post("/", isAuthenticated, handleSubmitPost);

//delete post

//update post(draft post will be updated only)
router.put("/:postId", isAuthenticated, handleUpdatePost);
//get all posts to show on feed
router.get("/", isAuthenticated, getAllPostsWithUsers);

//get posts by userId to show on user personal feed will include only submitted posts

//get posts by userId only draft posts

export default router;

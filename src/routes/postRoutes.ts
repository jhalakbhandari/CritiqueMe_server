import { Router } from "express";
// import { handleUserSignup } from "../controllers/userController";
import { handleSubmitPost } from "../controllers/postController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = Router();

//post posts
router.post("/", isAuthenticated, handleSubmitPost);

//get all posts
//get posts by userId

export default router;

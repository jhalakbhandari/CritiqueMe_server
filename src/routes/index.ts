import { Router } from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import postRoutes from "./postRoutes";
import summarizePortfolioRoutes from "./summarizePortfolioRoutes";
const router = Router();

router.get("/health-check", (req, res) => {
  res.status(200).json({
    status: "healthy",
    user: req.user,
  });
});
router.use("/posts", postRoutes);
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/summarize", summarizePortfolioRoutes);
export default router;

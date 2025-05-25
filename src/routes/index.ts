import { Router } from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
// import userRoutes from "./userRoutes";
const router = Router();

router.get("/health-check", (req, res) => {
  res.status(200).json({
    status: "healthy",
    user: req.user,
  });
});

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
export default router;

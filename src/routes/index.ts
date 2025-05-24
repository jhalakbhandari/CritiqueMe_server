import { Router } from "express";
import authRoutes from "./authRoutes";
const router = Router();

router.get("/health-check", (req, res) => {
  res.status(200).json({
    status: "healthy",
    user: req.user,
  });
});

router.use("/auth",authRoutes)
export default router;

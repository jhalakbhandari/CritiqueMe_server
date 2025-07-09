import express, { Router } from "express";
import { handleSummarize } from "../controllers/summarizePortfolioController";
import rateLimit from "express-rate-limit";

const router = Router();

// Add this just before the route
const summarizeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 5, // limit each IP to 5 requests per minute
  message: {
    status: 429,
    error: "Too many requests. Please try again in a minute.",
  },
});
router.post("/", summarizeLimiter, handleSummarize);

export default router;

import { Request, Response } from "express";
import { summarizePortfolio } from "../config/summarizer";

export const handleSummarize = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { description } = req.body;
  if (!description) {
    res.status(400).json({ error: "Description is required." });
    return;
  }

  try {
    const summary = await summarizePortfolio(description);
    res.json({ summary });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

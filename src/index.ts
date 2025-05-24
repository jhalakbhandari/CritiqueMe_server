import express, { Request, Response } from "express";
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Route with TypeScript types
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express with TypeScript!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

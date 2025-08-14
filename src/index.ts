import express, { Request, Response } from "express";
import dotenv from "dotenv";
import session from "express-session";
import passport from "./config/passport";
import routes from "./routes";
import cors from "cors";
import cron from "node-cron";
import { cleanupOrphanedData } from "./services/cleanUpService";

dotenv.config();
const app = express();
const PORT = 3000;

// Middleware
// app.use(express.json());
app.use(cors({ origin: process.env.Frontend_URL, credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", routes);
app.use(express.static("public"));

// Route with TypeScript types
// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello from Express with TypeScript!");
// });

//Clean unused data from db


// Start the server
app.listen(PORT, () => {
  console.clear(); // Add this in your entry point file, e.g., index.ts
  console.log(`Server is running on http://localhost:${PORT}`);
});

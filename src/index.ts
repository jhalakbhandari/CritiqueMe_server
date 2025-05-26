import express, { Request, Response } from "express";
import dotenv from "dotenv";
import session from "express-session";
import passport from "./config/passport";
import routes from "./routes";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = 3000;

// Middleware
// app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

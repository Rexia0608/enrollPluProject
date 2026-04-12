import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import dotenv from "dotenv";

import userAuthRouter from "./routes/userAuthRoutes.js";
import AdminRouter from "./routes/adminRoutes.js";
import StudentRouter from "./routes/studentRoutes.js";
import FacultyRouter from "./routes/facultyRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// IMPORTANT: needed for correct IP detection behind proxies (Render, Nginx, etc.)
app.set("trust proxy", 1);

// ----- Security Middlewares -----
app.use(helmet());

app.use(
  cors({
    origin: ["http://localhost:5173"], // change this to your frontend domain in production
    credentials: true,
  }),
);

app.use(express.json());

// ----- Rate Limiting -----
// Global limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, please try again later.",
});

// Auth limiter (login/register protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // safer for brute-force protection
  message: "Too many authentication attempts. Please try again later.",
});

// Admin / Faculty limiter
const adminFacultyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests. Please slow down.",
});

// ----- Apply Global Limiter -----
app.use(globalLimiter);

// ----- Routes -----
app.use("/enrollplus", authLimiter, userAuthRouter);

app.use("/admin", adminFacultyLimiter, AdminRouter);
app.use("/faculty", adminFacultyLimiter, FacultyRouter);

app.use("/student", StudentRouter);

// ----- Start Server -----
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

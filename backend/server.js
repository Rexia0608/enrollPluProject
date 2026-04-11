import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import userAuthRouter from "./routes/userAuthRoutes.js";
import AdminRouter from "./routes/adminRoutes.js";
import StudentRouter from "./routes/studentRoutes.js";
import FacultyRouter from "./routes/facultyRoutes.js";

dotenv.config();

const app = express();
const port = 3000;

// ----- Rate Limiting Config -----
// Global limiter – applies to all routes unless overridden
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Stricter limiter for authentication routes (prevent brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // only 10 login/register attempts per 15 minutes
  skipSuccessfulRequests: true, // don't count successful requests against the limit (optional)
  message: "Too many authentication attempts, please try again later",
});

// ----- Middleware -----
app.use(express.json());
app.use(cors());

// Apply global limiter to all requests
app.use(globalLimiter);

// ----- Routes -----
// For auth routes, apply the stricter limiter (overrides global)
app.use("/enrollplus", authLimiter, userAuthRouter);

// Other routes inherit the global limiter
app.use("/admin", AdminRouter);
app.use("/faculty", FacultyRouter);
app.use("/student", StudentRouter);

// ----- Start Server -----
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

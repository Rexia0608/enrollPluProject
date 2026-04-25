import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import dotenv from "dotenv";

import userAuthRouter from "./routes/userAuthRoutes.js";
import AdminRouter from "./routes/adminRoutes.js";
import StudentRouter from "./routes/studentRoutes.js";
import FacultyRouter from "./routes/facultyRoutes.js";

import "./automation/paymentReminderAutomation.js";

dotenv.config();

const app = express();
const port = process.env.BASE_PORT || 3000;

app.set("trust proxy", 1);

// ----- Security Middlewares -----
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "OPTIONS", "PATCH"],
    credentials: true,
  }),
);

app.use(express.json());

// ----- Rate Limiting -----
// Global limiter
const globalLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 500,
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
  skipSuccessfulRequests: false,
  message: "Too many authentication attempts. Please try again later.",
});

// ----- Routes -----
app.use("/enrollplus", authLimiter, userAuthRouter);

app.use("/admin", AdminRouter);
app.use("/faculty", FacultyRouter);

app.use("/student", globalLimiter, StudentRouter);

app.use(
  "/faculty/get-images",
  express.static("uploads/images", {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  }),
);

// ----- Start Server -----
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

import express from "express";
import cors from "cors";

import userAuthRouter from "./routes/userAuthRoutes.js";
import AdminRouter from "./routes/adminRoutes.js";
import StudentRouter from "./routes/studentRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
userAuthRouter;
const port = 3000;

app.use(express.json());
app.use(cors());

app.use("/enrollplus", userAuthRouter);
app.use("/admin", AdminRouter);
app.use("/student", StudentRouter);

app.listen(port, () => {
  console.log(`Server running in the port ${port}`);
});

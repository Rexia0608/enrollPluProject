import express from "express";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import authRouter from "./routes/authRoutes.js";
import AdminRouter from "./routes/adminRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);
app.use("/enrollplus", userRouter);
app.use("/admin", AdminRouter);

app.listen(port, () => {
  console.log(`Server running in the port ${port}`);
});

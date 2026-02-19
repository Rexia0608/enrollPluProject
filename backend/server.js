import express from "express";
import cors from "cors";
<<<<<<< HEAD
import authRouter from "./routes/authRoutes.js";
=======
import userAuthRouter from "./routes/userAuthRoutes.js";
>>>>>>> 5c8dcd30dd49ebb5e6fa159bd13d4ea17ad7129c
import AdminRouter from "./routes/adminRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

<<<<<<< HEAD
app.use("/enrollplus", authRouter);
=======
app.use("/auth", userAuthRouter);
>>>>>>> 5c8dcd30dd49ebb5e6fa159bd13d4ea17ad7129c
app.use("/admin", AdminRouter);

app.listen(port, () => {
  console.log(`Server running in the port ${port}`);
});

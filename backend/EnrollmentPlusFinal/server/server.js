import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler.js";
import accountsRoutes from "./routes/accountsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Your routes
app.use("/accounts", accountsRoutes);
app.use("/admin", adminRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running in the port ${port}`);
});

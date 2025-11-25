import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import indexRoutes from "./routes/index";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.use("/api", indexRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});
// lets test prisma
export default app;

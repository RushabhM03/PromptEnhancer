import "dotenv/config";
import express from "express";
import cors from "cors";
import promptRouter from "./routes/prompt.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/prompt", promptRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on :${PORT}`);
});

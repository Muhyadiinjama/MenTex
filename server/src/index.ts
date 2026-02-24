import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import chatRoute from "./routes/chat";
import chatsRoute from "./routes/chats";
import userRoute from "./routes/user";
import moodRoute from "./routes/mood.routes";
import { startCronJobs } from "./jobs/weeklyReportCron";

const app = express();
const port = Number(process.env.PORT) || 4000;
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/mindfulai";

mongoose.connect(mongoUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/chat", chatRoute);
app.use("/chats", chatsRoute);
app.use("/user", userRoute);
app.use("/api/mood", moodRoute);

// Start Cron Jobs
startCronJobs();

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});

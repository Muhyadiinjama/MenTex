import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import chatRoute from "./routes/chat.js";
import chatsRoute from "./routes/chats.js";
import userRoute from "./routes/user.js";
import moodRoute from "./routes/mood.routes.js";
import contactRoute from "./routes/contact.js";


const app = express();
const port = Number(process.env.PORT) || 4000;
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/mentex";

mongoose.connect(mongoUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/chat", chatRoute);
app.use("/chats", chatsRoute);
app.use("/user", userRoute);
app.use("/api/mood", moodRoute);
app.use("/contact", contactRoute);

// Start Cron Jobs (now handled by Firebase)

app.get("/", (_req, res) => {
  res.send("MenTex API is running. Use /health for status.");
});

// Health check
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});

// Export the Express app as a Firebase Cloud Function
import { onRequest } from "firebase-functions/v2/https";

export const api = onRequest(
  { region: "us-central1", cors: true, timeoutSeconds: 300, minInstances: 0 },
  app
);

// Export Scheduled job for Firebase
export * from "./jobs/weeklyReportCron.js";

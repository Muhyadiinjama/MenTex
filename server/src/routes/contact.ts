import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import { Feedback } from "../models/Feedback.js";

const router = express.Router();

// Configure multer for screenshot uploads (memory storage for simple forwarding)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

router.post("/", upload.single("screenshot"), async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        const file = req.file;

        // Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        console.log(`[Contact] Saving feedback from ${email}`);

        let screenshotBase64 = undefined;
        let screenshotName = undefined;

        // If a file was uploaded, convert it to Base64 to save in the database
        if (file) {
            console.log(`[Contact] Attaching file: ${file.originalname} (${file.size} bytes)`);
            screenshotBase64 = file.buffer.toString('base64');
            screenshotName = file.originalname;
        }

        // Save to MongoDB
        const newFeedback = new Feedback({
            name,
            email,
            subject,
            message,
            screenshotBase64,
            screenshotName
        });

        await newFeedback.save();
        console.log("[Contact] Feedback saved to database successfully!");

        res.json({ success: true, message: "Feedback submitted securely." });
    } catch (error: any) {
        console.error("Failed to save contact feedback to database:", error);

        res.status(500).json({
            error: "Failed to submit feedback",
            details: error.message,
            code: error.code
        });
    }
});

export default router;

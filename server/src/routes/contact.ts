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

        // Save to MongoDB first
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

        // Attempt to email it as a backup warning system
        try {
            if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });

                const mailOptions: any = {
                    from: `"${name}" <${process.env.EMAIL_USER}>`,
                    to: process.env.CONTACT_RECEIVER || "onebitdevelopers@gmail.com",
                    subject: `[MenTex Contact] ${subject}`,
                    text: `Contact Request from MenTex App\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
                    replyTo: email
                };

                if (file) {
                    mailOptions.attachments = [
                        { filename: file.originalname, content: file.buffer }
                    ];
                }

                await transporter.sendMail(mailOptions);
                console.log("[Contact] Email forwarded successfully!");
            } else {
                console.log("[Contact] Email ignored: Missing EMAIL_USER or EMAIL_PASS environment variables.");
            }
        } catch (emailError: any) {
            console.error("[Contact] Email sending failed, but feedback was saved to DB:", emailError.message);
        }

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

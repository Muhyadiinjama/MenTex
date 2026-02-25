import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";

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

        // Email Transport Configuration
        // NODE: The user needs to set these in their .env for it to work.
        // For Gmail, they need to use an "App Password".
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        console.log(`[Contact] Sending email from ${email} to ${process.env.CONTACT_RECEIVER || "onebitdevelopers@gmail.com"}`);

        const mailOptions: any = {
            from: `"${name}" <${process.env.EMAIL_USER}>`,
            to: process.env.CONTACT_RECEIVER || "onebitdevelopers@gmail.com",
            subject: `[MenTex Contact] ${subject}`,
            text: `Contact Request from MenTex App\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            replyTo: email
        };

        // Attach screenshot if it exists
        if (file) {
            console.log(`[Contact] Attaching file: ${file.originalname} (${file.size} bytes)`);
            mailOptions.attachments = [
                {
                    filename: file.originalname,
                    content: file.buffer
                }
            ];
        }

        console.log("[Contact] Sending email via transporter...");
        await transporter.sendMail(mailOptions);
        console.log("[Contact] Email sent successfully!");

        res.json({ success: true, message: "Email sent successfully" });
    } catch (error: any) {
        console.error("Failed to send contact email!");
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        if (error.stack) console.error("Stack Trace:", error.stack);

        res.status(500).json({
            error: "Failed to send email",
            details: error.message,
            code: error.code
        });
    }
});

export default router;

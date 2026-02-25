import "dotenv/config";
import nodemailer from "nodemailer";

async function test() {
    console.log("Testing with:", process.env.EMAIL_USER, process.env.EMAIL_PASS);
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        await transporter.verify();
        console.log("Transporter verified successfully!");
    } catch (error) {
        console.error("Transporter verification failed:", error);
    }
}

test();

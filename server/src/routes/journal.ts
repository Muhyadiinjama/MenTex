import express from "express";
import { Journal } from "../models/Journal.js";
import { analyzeJournal } from "../services/gemini.js";

const router = express.Router();

// 1. Create a Journal entry
router.post("/", async (req, res) => {
    try {
        const { userId, title, content, category } = req.body;

        if (!userId || !title || !content) {
            return res.status(400).send({ error: "Missing required fields" });
        }

        // AI Analysis for Mood Insights
        let moodInsights: string[] = [];
        try {
            moodInsights = await analyzeJournal(content);
        } catch (aiError) {
            console.error("AI Analysis failed:", aiError);
        }

        const newJournal = new Journal({ userId, title, content, category, moodInsights });
        const savedJournal = await newJournal.save();
        res.status(201).json(savedJournal);
    } catch (err: any) {
        console.error("Failed to create journal:", err);
        res.status(500).send({ error: "Failed to create journal entry" });
    }
});

// 2. Get all journals for a user
router.get("/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const journals = await Journal.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(journals);
    } catch (err: any) {
        console.error("Failed to fetch journals:", err);
        res.status(500).send({ error: "Failed to fetch journals" });
    }
});

// 3. Delete a journal
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Journal.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).send({ error: "Journal not found" });
        }
        res.status(200).send({ message: "Journal deleted successfully" });
    } catch (err: any) {
        console.error("Failed to delete journal:", err);
        res.status(500).send({ error: "Failed to delete journal" });
    }
});

// 4. Update a journal entry
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, category } = req.body;

        const updated = await Journal.findByIdAndUpdate(id, { title, content, category }, { new: true });
        if (!updated) {
            return res.status(404).send({ error: "Journal not found" });
        }
        res.status(200).json(updated);
    } catch (err: any) {
        console.error("Failed to update journal:", err);
        res.status(500).send({ error: "Failed to update journal" });
    }
});

export default router;

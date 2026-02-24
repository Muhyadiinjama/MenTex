import express from 'express';
import { db } from '../services/db.js';

const router = express.Router();

// Get user profile
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const profile = await db.getUserProfile(userId);
        res.json(profile);
    } catch (error) {
        console.error("Profile fetch error", error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Update user profile
router.post('/update', async (req, res) => {
    try {
        const { userId, ...data } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'Missing userId' });
        }
        const updated = await db.updateUserProfile(userId, data);
        res.json(updated);
    } catch (error) {
        console.error("Profile update error", error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

export default router;

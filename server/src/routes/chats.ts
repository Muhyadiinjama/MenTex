import express from 'express';
import { db } from '../services/db';

const router = express.Router();

// Get all chats for a user
router.get('/', async (req, res) => {
    const userId = req.query.userId as string;
    if (!userId) {
        res.status(400).json({ error: 'Missing userId' });
        return;
    }
    const chats = await db.getUserChats(userId);
    res.json(chats);
});

// Create a new chat
router.post('/', async (req, res) => {
    const { userId, title } = req.body;
    if (!userId) {
        res.status(400).json({ error: 'Missing userId' });
        return;
    }
    const chat = await db.createChat(userId, title);
    res.json(chat);
});

// Get a specific chat history
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const chat = await db.getChat(id);
    if (!chat) {
        res.status(404).json({ error: 'Chat not found' });
        return;
    }
    res.json(chat);
});

// Delete a chat history
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await db.deleteChat(id);
    res.json({ success: true });
});

export default router;

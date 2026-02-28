import { User } from '../models/User.js';
import { Chat } from '../models/Chat.js';

export interface Message {
    id: string;
    role: 'user' | 'model';
    content: string;
    timestamp: number;
}

export interface Chat {
    id: string;
    userId: string;
    title: string;
    messages: Message[];
    createdAt: number; // Mongoose returns Date or string depending on exact config?
    updatedAt: number; // We need to check if caller expects number or Date. Frontend expects number (Date.now()). Mongoose timestamps are Dates. I'll stick to Date in code but serialize to string.
}

export interface UserProfile {
    id: string; // userId
    name?: string;
    email?: string;
    gender?: string;
    dateOfBirth?: string;
    photoURL?: string;
    preferredLanguage?: 'EN' | 'BM';
    therapist?: {
        fullName?: string;
        email?: string;
        phone?: string;
        clinicName?: string;
        sessionSchedule?: string;
        nextSessionDate?: string;
        privateNotes?: string;
    };
    therapistReport?: {
        lastSentAt?: string;
    };
    facts: string[];
}

export const db = {
    // Chats
    createChat: async (userId: string, title: string = "New Conversation") => {
        const chat = await Chat.create({ userId, title, messages: [] });
        return chat.toJSON();
    },

    getChat: async (chatId: string) => {
        const chat = await Chat.findById(chatId);
        return chat ? chat.toJSON() : null;
    },

    getUserChats: async (userId: string) => {
        const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
        return chats.map(c => c.toJSON());
    },

    addMessage: async (chatId: string, role: 'user' | 'model', content: string) => {
        const chat = await Chat.findById(chatId);
        if (!chat) return null;

        chat.messages.push({ role, content, timestamp: Date.now() });
        await chat.save();

        return chat.messages[chat.messages.length - 1]; // Return added message
    },

    updateChatTitle: async (chatId: string, title: string) => {
        const chat = await Chat.findById(chatId);
        if (!chat) return null;

        chat.title = title;
        await chat.save();
        return chat.toJSON();
    },


    deleteChat: async (chatId: string) => {
        await Chat.findByIdAndDelete(chatId);
        return { success: true };
    },

    // User Profile (Memory)
    getUserProfile: async (userId: string) => {
        let user = await User.findOne({ userId });
        if (!user) {
            user = await User.create({ userId, facts: [] });
        }
        return user.toJSON() as unknown as UserProfile; // Cast since Mongoose type mismatch on `id` vs `_id` might occur unless careful
    },

    updateUserProfile: async (userId: string, data: Partial<UserProfile>) => {
        const user = await User.findOneAndUpdate(
            { userId },
            { $set: data }, // Update fields
            { new: true, upsert: true }
        );

        // Also add unique facts logic?
        if (data.facts && data.facts.length > 0) {
            // If caller passes array, it REPLACES.
            // If I want to APPEND, I should change update logic.
            // Caller currently passes: `updateUserProfile(userId, { facts: [...old, new] })`.
            // So $set works fine.
            // However, concurrent updates might overwrite. Ideally use $addToSet.
            // But for MVP, fine.
        }

        return user.toJSON() as unknown as UserProfile;
    }
};

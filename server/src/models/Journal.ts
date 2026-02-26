import mongoose, { Schema, Document } from "mongoose";

export interface IJournal extends Document {
    userId: string;
    title: string;
    content: string;
    moodInsights?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const JournalSchema: Schema = new Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, default: "Personal" },
    moodInsights: [{ type: String }],
}, { timestamps: true });

export const Journal = mongoose.model<IJournal>("Journal", JournalSchema);

import mongoose, { Schema, Document } from "mongoose";

export interface IFeedback extends Document {
    name: string;
    email: string;
    subject: string;
    message: string;
    screenshotBase64?: string;
    screenshotName?: string;
    createdAt: Date;
}

const FeedbackSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    screenshotBase64: { type: String },
    screenshotName: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export const Feedback = mongoose.model<IFeedback>("Feedback", FeedbackSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface IMood extends Document {
  userId: string;
  emoji: '😭' | '😢' | '😐' | '🙂' | '😊' | '😔' | '😰' | '😴' | '🌟';
  moodScore: number;
  note: string;
  timestamp: Date;
  analyzed: boolean;
}

const MoodSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  emoji: { type: String, required: true, enum: ['😭', '😢', '😐', '🙂', '😊', '😔', '😰', '😴', '🌟'] },
  moodScore: { type: Number, required: true, min: 1, max: 5 },
  note: { type: String, maxlength: 500 },
  timestamp: { type: Date, default: Date.now, index: true },
  analyzed: { type: Boolean, default: false }
});

export const Mood = mongoose.model<IMood>('Mood', MoodSchema);

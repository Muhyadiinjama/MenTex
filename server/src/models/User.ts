import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true }, // using Guest ID string
    email: { type: String, unique: true, sparse: true },
    dateOfBirth: String,
    gender: String,
    facts: { type: [String], default: [] },
    name: String,
    photoURL: String,
    preferences: [String],
    preferredLanguage: { type: String, enum: ['EN', 'BM'], default: 'EN' },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);

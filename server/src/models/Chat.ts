import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    role: { type: String, enum: ['user', 'model'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Number, default: Date.now }
});

messageSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_doc: any, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
    }
});

const chatSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    title: String,
    messages: [messageSchema]
}, { timestamps: true });

chatSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_doc: any, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
    }
});

export const Chat = mongoose.model('Chat', chatSchema);

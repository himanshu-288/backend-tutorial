import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  username: { type: String, required: true, trim: true, lowercase: true, maxlength: 30, unique: true },
  email: { type: String, required: true, trim: true, lowercase: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, unique: true },
  passwordHash: { type: String, required: true, select: false },
  sessionHash: { type: String, select: false },
  expiresAt: Date
}, { timestamps: true });

export default mongoose.model('User', schema);

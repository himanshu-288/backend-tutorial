import mongoose from 'mongoose';

export default mongoose.model('Post', new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 1, max: 150, validate: Number.isInteger }
}, { timestamps: true }));

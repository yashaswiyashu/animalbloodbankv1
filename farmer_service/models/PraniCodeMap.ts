import mongoose from 'mongoose';

const codeMapSchema = new mongoose.Schema({
  type: { type: String, enum: ['species', 'breed', 'state', 'pin_code'], required: true },
  name: { type: String, required: true },
  code: { type: Number, required: true },
});

codeMapSchema.index({ type: 1, name: 1 }, { unique: true });

export const PraniCodeMap = mongoose.model('PraniCodeMap', codeMapSchema);

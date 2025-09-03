import mongoose from 'mongoose';

const bloodTypingRequestSchema = new mongoose.Schema({
  labId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  species: String,
  breed: String,
  age: Number,
  location: String, // formatted string
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Completed'],
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('BloodTypingRequest', bloodTypingRequestSchema);

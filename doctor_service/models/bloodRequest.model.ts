import mongoose from 'mongoose';

const DonorInfoSchema = new mongoose.Schema({
  praniAadharNumber: String,
  species: String,
  breed: String,
  age: Number,
  bloodGroup: String,
  location: String,
}, { _id: false });

const bloodRequestSchema = new mongoose.Schema({
  praniAadharNumber: { type: String, required: true },
  species: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  bloodGroup: {type: String, required: true},
  location: { type: String, required: true },
  quantity: { type: String, required: true },
  reason: { type: String, required: true },
  image: { type: String }, // optional
  matchedDonors: [DonorInfoSchema],
//   matchedDonors: [
//   {
//     praniAadharNumber: String,
//     species: String,
//     breed: String,
//     age: Number,
//     bloodGroup: String,
//     location: String
//   }
// ],
  healthRecord: {
    description: { type: String },
    fileUrl: { type: String },
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Matched'],
    default: 'Pending',
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('BloodRequest', bloodRequestSchema);

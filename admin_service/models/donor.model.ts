import mongoose from 'mongoose';

const donorSchema = new mongoose.Schema({
    praniAadharNumber: String,
    weight: String,
    species: String,
    breed: String,
    age: Number,
    bloodGroup: String,
    location: String,
    image: String,
    healthRecord: {
        description: String,
        fileUrl: String,
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending',
    },

}, { timestamps: true });

export default mongoose.model('Donor', donorSchema);

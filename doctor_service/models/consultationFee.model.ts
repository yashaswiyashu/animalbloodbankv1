import mongoose, { Schema } from 'mongoose';

const ConsultationFeeSchema = new Schema({
  doctorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User', // or 'Doctor'
    unique: true,
  },
  fee: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

export const ConsultationFeeModel = mongoose.model('ConsultationFee', ConsultationFeeSchema);

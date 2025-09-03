import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment extends Document {
  doctorId: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  status: string;
  farmerName: string;
  farmerContact: string;
  type: string;
  name: string;
  species: string;
  praniAadharNumber: string;
  farmer_id: string;
}

const AppointmentSchema: Schema = new Schema({
  doctorId: { type: Schema.Types.ObjectId, required: true },
  start_date: { type: String, required: true },
  start_time: { type: String, required: true },
  end_date: { type: String, required: true },
  end_time: { type: String, required: true },
  status: { type: String, enum: ['booked', 'completed', 'cancelled'], default: 'booked' },
  farmerName: { type: String, required: true },
  farmerContact: { type: String, required: true },
  type: { type: String, required: true },
  species: { type: String, required: true },
  praniAadharNumber: { type: String, required: true },
  farmer_id: { type: String, required: true },
});

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema);

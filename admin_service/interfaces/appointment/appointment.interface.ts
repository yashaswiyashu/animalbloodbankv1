
import mongoose from "mongoose";

export interface IAppointment extends Document {
  doctor: mongoose.Types.ObjectId;
  farmer: mongoose.Types.ObjectId;
  start_date: string; // e.g. "2024-05-20"
  start_time: string; // e.g. "10:30"
  end_date: string; // e.g. "2024-05-20"
  end_time: string; // e.g. "11:30"
  status: string; // booked, completed, cancelled
  farmerName: string;
  farmerContact: string;
  type: string;
  species: string;
  praniAadharNumber: string;
}

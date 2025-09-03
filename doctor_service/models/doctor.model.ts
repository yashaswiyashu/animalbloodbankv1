import mongoose, { Schema, Document } from "mongoose";

export interface IDoctor extends Document {
  user: mongoose.Types.ObjectId;
  availableSlots: {
    start_date: string;   // "2025-05-20"
    start_time: string;   // "10:30"
    end_date: string;     // "2025-05-20"
    end_time: string;     // "11:30"
  }[];
}

const DoctorSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  availableSlots: [
    {
      start_date: { type: String, required: true },
      start_time: { type: String, required: true },
      end_date: { type: String, required: true },
      end_time: { type: String, required: true },
    },
  ],
});

export const DoctorModel = mongoose.model<IDoctor>("Doctor", DoctorSchema);

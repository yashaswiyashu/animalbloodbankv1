import mongoose, { Schema, Document } from "mongoose";

export interface IImage extends Document {
  imageUrl: string;
  hosital_id: string;
}

const ImageSchema: Schema = new Schema({
  imageUrl: { type: String, required: true },
  hospital_id: { type: String, required: true },
});

export default mongoose.model<IImage>("HospitalImage", ImageSchema);

import mongoose, { Schema, Document } from "mongoose";

export interface IImage extends Document {
  imageUrl: string;
  organisation_id: string;
}

const ImageSchema: Schema = new Schema({
  imageUrl: { type: String, required: true },
  organisation_id: { type: String, required: true}
});

export default mongoose.model<IImage>("Image", ImageSchema);

// models/Message.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  content: string;
  organisation_id: string;
}

const messageSchema: Schema = new Schema({
  content: { type: String, required: true },
  organisation_id: { type: String, required: true },
}, { timestamps: true });

export const Message = mongoose.model<IMessage>('Message', messageSchema);

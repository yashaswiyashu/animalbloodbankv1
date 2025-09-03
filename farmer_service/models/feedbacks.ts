import { Schema, model, Document } from 'mongoose';

export interface IFeedback extends Document {
  farmerName: string;
  praniAadharNumber: string;
  description: string;
  filePath: string;
  originalFileName: string;
  submittedAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>({
  farmerName: { type: String, required: true },
  praniAadharNumber: { type: String, required: true },
  description: { type: String, required: true },
  filePath: { type: String, required: true },
  originalFileName: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
});

export default model<IFeedback>('Feedback', FeedbackSchema);



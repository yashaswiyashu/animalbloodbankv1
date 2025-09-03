import mongoose, { Document, Schema } from "mongoose";

export interface IPayment extends Document {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  amount: number;
  currency: string;
  status: "success" | "failure";
  createdAt: Date;
  farmer_id: string;
  refund_id?: string;
  refund_status?: "initiated" | "processed" | "failed";
}

const PaymentSchema = new Schema<IPayment>({
  razorpay_order_id: { type: String, required: true },
  razorpay_payment_id: { type: String, required: true },
  razorpay_signature: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, enum: ["success", "failure"], required: true },
  createdAt: { type: Date, default: Date.now },
  farmer_id: {type: String, required: true},
  refund_id: { type: String },
  refund_status: { type: String, enum: ["initiated", "processed", "failed"] }
});

export const PaymentModel = mongoose.model<IPayment>("Payment", PaymentSchema);

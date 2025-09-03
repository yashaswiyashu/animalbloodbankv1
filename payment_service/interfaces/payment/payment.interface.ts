import { Request } from "express";

export interface PaymentConfirmRequestInventory extends Request {
    body: {
        razorpay_order_id?: string; // Optional, for payment verification
        razorpay_payment_id?: string; // Optional, for payment verification
        razorpay_signature?: string; // Optional, for payment verification
        amount?: number; // Optional, for payment verification
        farmer_id: string;
    };
    user?: any;
}

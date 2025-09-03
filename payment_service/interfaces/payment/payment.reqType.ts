import { Request } from "express";

export interface PaymentRequestInventory extends Request {
    body: {
        amount: number; // Amount in the smallest currency unit (e.g., cents for USD)
        currency: string; // Currency code (e.g., 'INR', 'USD')
    };
    user?: any;
}

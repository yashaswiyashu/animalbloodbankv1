import type { Response } from "express";
import { instance } from "../config/razorpay";
import crypto from 'crypto';
import type { PaymentRequestInventory } from "../interfaces/payment/payment.reqType.js";
import type { PaymentConfirmRequestInventory } from "../interfaces/payment/payment.interface.js";
import type { Request } from 'express';
import { PaymentModel } from "../models/payment.model";

export const processPayment = async (req: PaymentRequestInventory, res: Response) => {
  const { amount, currency } = req.body;
    const options = {
        amount: Number(amount*100), // Convert to smallest currency unit
        currency: currency,
        // receipt: receipt,
    };
    try {
        const order = await instance.orders.create(options);
        res.status(200).json(order);
    }
    catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ error: "Failed to create order" });
    }
}

export const getRazorpayKey = async (req: Request, res: Response) : Promise<void> => {
    try {
        const key = process.env.RAZORPAY_API_KEY;
        if (!key) {
            res.status(500).json({ error: "Razorpay API key not found" });
            return;
        }
        res.status(200).json({ key });
        return;
    }
    catch (error) {
        console.error("Error retrieving Razorpay API key:", error);
        res.status(500).json({ error: "Failed to retrieve Razorpay API key" });
        return;
    }
}

export const paymentVerification = async (req: PaymentConfirmRequestInventory, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, farmer_id } = req.body;
  const secret = process.env.RAZORPAY_API_SECRET;

  if (!secret) {
    res.status(500).json({ status: "failure", message: "Razorpay API secret not found" });
    return;
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto.createHmac("sha256", secret)
    .update(body.toString())
    .digest("hex");

  const isValid = expectedSignature === razorpay_signature;

  try {
    const payment = new PaymentModel({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount: amount ? amount : 0, // optionally update after fetching from Razorpay if needed
      currency: "INR",
      status: isValid ? "success" : "failure",
      farmer_id
    });

    await payment.save();

    if (isValid) {
      res.status(200).json({
        status: "success",
        transactionId: razorpay_payment_id,
      });
    } else {
      res.status(400).json({
        status: "failure",
        message: "Invalid payment signature",
      });
    }
  } catch (err) {
    console.error("Error saving payment:", err);
    res.status(500).json({ status: "failure", message: "Server error" });
  }
};


// export const refundPayment = async (req: Request, res: Response):Promise<void> => {
//   const { paymentId } = req.body;

//   try {
//     const payment = await PaymentModel.findOne({ razorpay_payment_id: paymentId });

//     if (!payment || payment.status !== 'success') {
//       res.status(404).json({ message: 'Valid successful payment not found' });
//       return 
//     }

//     const refund = await instance.payments.refund(paymentId, {
//       amount: payment.amount, // full refund
//     });

//     payment.refund_id = refund.id;
//     payment.refund_status = 'initiated';
//     await payment.save();

//     res.status(200).json({
//       message: 'Refund initiated successfully',
//       refundId: refund.id,
//       refund
//     });
//   } catch (error: any) {
//     console.error('Refund error:', error);
//     res.status(500).json({ message: 'Refund failed', error: error.message });
//   }
// };




// POST /api/payment/refund
export const refundPayment = async (req: Request, res: Response):Promise<void> => {
  const { farmer_id, appointment_id } = req.body;

  try {
    // 1. Find the payment by farmer_id or appointment_id
    const payment = await PaymentModel.findOne({
      farmer_id,
      status: 'success'
    }).sort({ createdAt: -1 });

    if (!payment) {
      res.status(404).json({ message: 'Payment not found' });
      return 
    }

    // 2. Initiate refund
    const refund = await instance.payments.refund(payment.razorpay_payment_id, {
      amount: payment.amount
    });

    // 3. Update DB
    payment.refund_id = refund.id;
    payment.refund_status = 'initiated';
    await payment.save();

    res.status(200).json({
      message: 'Refund initiated',
      refund_id: refund.id
    });

  } catch (error: any) {
    console.error('Refund failed:', error);
    res.status(500).json({ message: 'Refund error', error: error.message });
  }
};

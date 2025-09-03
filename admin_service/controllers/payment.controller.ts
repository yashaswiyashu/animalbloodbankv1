import { Request, Response } from "express";

// controllers/paymentController.js
import {PaymentModel} from "../models/payment.model";

export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const payments = await PaymentModel.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Payments fetched successfully", payments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTotalPayments = async (req: Request, res: Response) => {
  try {
    const payments = await PaymentModel.find();

    // Calculate total revenue (only from successful payments, if needed)
    const totalRevenue = payments.reduce((acc, payment) => {
      if (payment.status === "success") {
        return acc + payment.amount;
      }
      return acc;
    }, 0);

    res.status(200).json({
      message: "Payments fetched successfully",
      totalRevenue,
      totalPayments: payments.length,
      payments
    });
    
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

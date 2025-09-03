import { Request } from "express";

export interface BookAppointment extends Request {
  body: {
    doctorId: string;
    start_date: string;
    start_time: string;
    end_date: string;
    end_time: string;
    status: string; // booked, completed, cancelled
    farmerName: string;
    farmerContact: string;
    type: string;
    species: string;
    praniAadharNumber: string;
    farmer_id: string;
    razorpay_payment_id?: string; // Optional, for payment verification
    healthRecord: string;
  };
  user?: any; // if auth middleware adds farmer info to req
}
import { Request, Response } from "express";

// controllers/appointmentController.js
import Appointment from "../models/appointment.model";

export const getAllAppointments = async (req: Request, res: Response): Promise<void> => {
  try {
    const appointments = await Appointment.find().sort({ start_date: 1, start_time: 1 });
    res.status(200).json({ message: "Appointments fetched successfully", appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllAppointmentsCompleted = async (req: Request, res: Response): Promise<void> => {
  try {
    const appointments = await Appointment.find({status: "completed"}).sort({ start_date: 1, start_time: 1 });
    res.status(200).json({ message: "Appointments fetched successfully", appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllAppointmentsBooked = async (req: Request, res: Response): Promise<void> => {
  try {
    const appointments = await Appointment.find({status: "booked"}).sort({ start_date: 1, start_time: 1 });
    res.status(200).json({ message: "Appointments fetched successfully", appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

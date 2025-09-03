import { Request, Response } from "express";
import { BookAppointment } from "../interfaces/appointment/appointment.reqType";
import AppointmentModel from "../models/appointment.model";
import { DoctorModel } from "../models/doctor.model";

export const bookAppointment = async (req: BookAppointment, res: Response): Promise<void> => {
  const { doctorId, start_date, start_time, end_date, end_time, farmerName, farmerContact, type,species, praniAadharNumber, } = req.body;
  const farmerId = req.user._id;
  console.log(doctorId);
  
  // Check slot exists
  const doctor = await DoctorModel.findOne({ user: doctorId });
  if (!doctor) {
    res.status(404).json({ message: "Doctor not found" });
    return;
  }
  const slotExists = doctor.availableSlots.find(
    (s) => s.start_date === start_date && s.start_time === start_time
  );
  if (!slotExists) {
    res.status(400).json({ message: "Slot not available" });
    return;
  }

  // Check if already booked
  const isBooked = await AppointmentModel.findOne({
    doctorId,
    start_date,
    start_time,
    end_date,
    end_time,
    farmerName,
    farmerContact,
    type,
    species,
    praniAadharNumber,
    farmerId,
  });
  if (isBooked) {
    res.status(400).json({ message: "Slot already booked" });
    return;
  }

  // Book appointment
  const appointment = await AppointmentModel.create({
    doctorId,
    farmer_id: farmerId,
    start_date,
    start_time,
    status: "booked",
    end_date,
    end_time,
    farmerName,
    farmerContact,
    type,
    species,
    praniAadharNumber,
  });

  res.status(201).json({ message: "Appointment booked", appointment });
};

export const getAppointmentsByDate = async (req: BookAppointment, res: Response): Promise<void> => {
  const { doctorId, start_date } = req.params;

  try {
    const appointments = await AppointmentModel.find({
      doctorId,
      start_date,
    }).populate("doctorId", "user_name user_email") // optional populate doctor info
      .sort({ start_time: 1 });

    res.status(200).json({
      message: "Appointments fetched successfully",
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch appointments",
      error,
    });
  }
};

export const getAppointmentsByDoctor = async (req: BookAppointment, res: Response): Promise<void> => {
  const { doctorId } = req.params;

  try {
    const appointments = await AppointmentModel.find({
      doctorId,
    }).populate("doctorId", "user_name user_email") // optional populate doctor info
      .sort({ start_time: 1 });

    res.status(200).json({
      message: "Appointments fetched successfully",
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch appointments",
      error,
    });
  }
};


export const getAppointmentsByFarmer = async (req: BookAppointment, res: Response): Promise<void> => {
  const { farmerId } = req.params;

  try {
    const appointments = await AppointmentModel.find({
      farmer_id: farmerId,
      
    })
      
    .populate({
    path: "doctorId",
    model: 'User',
    select: "user_name specialization city taluk district state country pin_code"
    })

// console.log("Populated Appointments:", JSON.stringify(appointments, null, 2));

    res.status(200).json({
      message: "Appointments fetched successfully",
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch appointments",
      error,
    });
  }
};



export const cancelAppointment = async (req: BookAppointment, res: Response):Promise<void> => {
    try {
        const { id } = req.params;
        
        const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
            id,
            { status: 'cancelled' },
            { new: true, runValidators: true }
        ).populate('doctorId', 'user_name specialization');

        if (!updatedAppointment) {
            res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
            return 
        }

        res.status(200).json({
            success: true,
            message: 'Appointment cancelled successfully',
            data: updatedAppointment
        });

    } catch (error) {
        console.error('Error cancelling appointment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel appointment',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const completeAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
      id,
      { status: "completed" },
      { new: true, runValidators: true }
    ).populate("doctorId", "user_name specialization");

    if (!updatedAppointment) {
      res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Appointment marked as completed",
      data: updatedAppointment,
    });
  } catch (error) {
    console.error("Error completing appointment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to complete appointment",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};




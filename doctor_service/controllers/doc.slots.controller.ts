import { Request, Response } from "express";
import { DoctorModel } from "../models/doctor.model";
import { AddAppointmentShedule } from "../interfaces/doctor-slots/doc.slots.reqType";

export const createAvailableSlot = async (req: AddAppointmentShedule, res: Response) => {
  const { start_date, start_time, end_date, end_time } = req.body;
  const userId = req.user._id;

  const doctor = await DoctorModel.findOne({ user: userId });
  if (!doctor) {
    const newDoctor = await DoctorModel.create({
      user: userId,
      availableSlots: [{ start_date, start_time, end_date, end_time }],
    });
    res.status(201).json({ message: "Slot created", doctor: newDoctor });
    return;
  }

  // Prevent duplicate slot
  const isExists = doctor.availableSlots.find(
    (s) => s.start_date === start_date && s.start_time === start_time
  );
  if (isExists) {
    res.status(400).json({ message: "Slot already exists" });
    return;
  }

  doctor.availableSlots.push({ start_date, start_time, end_date, end_time });
  await doctor.save();

  res.status(200).json({ message: "Slot added", doctor });
};

export const getAvailableSlotsForDoctor = async (req: Request, res: Response): Promise<void> => {
  const { doctorId } = req.params;

  const doctor = await DoctorModel.findOne({ user: doctorId });
  if (!doctor) {
    res.status(404).json({ message: "Doctor not found" });
    return;
  }

  // const availableSlots = doctor.availableSlots.filter((slot) => slot.start_date === start_date);

  res.status(200).json({ doctor });
};


export const getAvailableSlotsForDate = async (req: Request, res: Response): Promise<void> => {
  const { doctorId, start_date } = req.params;

  const doctor = await DoctorModel.findOne({ user: doctorId });
  if (!doctor) {
    res.status(404).json({ message: "Doctor not found" });
    return;
  }

  const availableSlots = doctor.availableSlots.filter(
    (slot) => slot.start_date === start_date
  );

  res.status(200).json({ availableSlots });
};


export const removeAvailableSlot = async (req: AddAppointmentShedule, res: Response): Promise<void> => {
  const { start_date, start_time, end_date, end_time } = req.body;
  const userId = req.user._id;

  try {
    const doctor = await DoctorModel.findOne({ user: userId });
    if (!doctor) {
      res.status(404).json({ message: 'Doctor not found' });
      return 
    }

    const originalCount = doctor.availableSlots.length;

    // Remove slot by filtering
    doctor.availableSlots = doctor.availableSlots.filter(
      (s) =>
        !(
          s.start_date === start_date &&
          s.start_time === start_time &&
          s.end_date === end_date &&
          s.end_time === end_time
        )
    );

    if (doctor.availableSlots.length === originalCount) {
      res.status(404).json({ message: 'Slot not found' });
      return 
    }

    await doctor.save();

    res.status(200).json({ message: 'Slot removed successfully' });
  } catch (error) {
    console.error('Remove slot error:', error);
    res.status(500).json({ message: 'Failed to remove slot', error });
  }
};

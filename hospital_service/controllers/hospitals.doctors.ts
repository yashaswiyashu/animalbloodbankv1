import { Request, Response } from 'express';
import User from '../models/user.model';

export const getDoctorsByHospitalId = async (req: Request, res: Response): Promise<void> => {
  const { hospitalId } = req.params;

  try {
    const doctors = await User.find({ hospital_id: hospitalId });

    if (!doctors || doctors.length === 0) {
      res.status(404).json({ message: 'No doctors found for this hospital' });
    return
    }

    res.status(200).json({ doctors });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const updateDoctor = async (req: Request, res: Response):Promise<void> => {
  try {
    const userId = req.params.id;

    // Extract body fields
    const {
      user_name,
      user_email,
      user_phone,
      city,
      taluk,
      district,
      state,
      country,
      pin_code,
      specialization,
      govt_id,
      approved,
    } = req.body;

    // Build update object
    const updateFields: any = {
      user_name,
      user_email,
      user_phone,
      city,
      taluk,
      district,
      state,
      country,
      pin_code,
      specialization,
      govt_id,
    };

    // Convert approved to Boolean
    if (approved !== undefined) {
      updateFields.approved = approved === "true" || approved === true;
    }

    // Attach image if file was uploaded
    if (req.file) {
      updateFields.govt_id_image = req.file.filename;
    }

    console.log("🔧 Update fields:", updateFields);

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
    return;
  } catch (error) {
    console.error("❌ Update error:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export const deleteDoctor = async (req: Request, res: Response):Promise<void> => {
  try {
    const { id } = req.params;

    const deleted = await User.findByIdAndDelete(id);

    if (!deleted)
      res.status(404).json({ message: 'Doctor not found' });
    return 

    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
};

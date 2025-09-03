import { Request, Response } from "express";
import { getOrgHospitalReq } from "../interfaces/organisation.hospitals/organisation.hospital.reqType";
import  User from "../models/user.model";


export const getOrgHospitals = async (req: getOrgHospitalReq, res: Response) => {
  try {
    const { organisation_id } = req.params;
    const hospitals = await User.find({
      user_role: "hospital",
      // organisation_id: { $exists: true, $ne: null }
      organisation_id: organisation_id
    });

    res.status(200).json({
      message: "Hospitals with organisation_id fetched successfully",
      hospitals,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch hospitals", error });
  }
};

export const updateHospital = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

  try {
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
      organisation_id,
      approved,
    } = req.body;

    const updates: any = {
      user_name,
      user_email,
      user_phone,
      city,
      taluk,
      district,
      state,
      country,
      pin_code,
      organisation_id,
    };

    if (approved !== undefined) {
      updates.approved = approved === "true" || approved === true;
    }

    if (req.file) {
      updates.govt_id_image = req.file.filename;
    }

    console.log("🔧 Hospital Update Data:", updates);

    const updatedHospital = await User.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedHospital) {
      res.status(404).json({ message: "Hospital not found" });
      return;
    }

    res.status(200).json({ message: "Hospital updated successfully", hospital: updatedHospital });
  } catch (error) {
    console.error("❌ Error updating hospital:", error);
    res.status(500).json({ message: "Error updating hospital", error });
  }
};

export const deleteHospitalByOrganisation = async (req: Request, res: Response):Promise<void> => {
  try {
    const { id } = req.params;

    const deletedHospital = await User.findOneAndDelete({ _id: id, user_role: "hospital" });

    if (!deletedHospital) {
      res.status(404).json({ message: "Hospital not found" });
      return;
    }

    res.status(200).json({ message: "Hospital deleted successfully" });
  } catch (error) {
    console.error("Error deleting hospital:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getDoctorsByOrganisation = async (req: Request, res: Response) => {
  try {
    const { orgId } = req.params;
    const doctors = await User.find({
      user_role: 'doctor',
      organisation_id: orgId
    });

    res.status(200).json({
      message: 'Doctors fetched successfully',
      doctors
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


// export const deleteDoctorByOrganisation = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const doctor = await User.findOneAndDelete({ _id: id, user_role: "doctor" });

//     if (!doctor) {
//       return res.status(404).json({ message: "Doctor not found" });
//     }

//     res.status(200).json({ message: "Doctor deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting doctor:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// export const updateDoctorByOrganisation = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     if (req.file) {
//       updates.fileUrl = `uploads/${req.file.filename}`;
//     }

//     const doctor = await User.findOneAndUpdate(
//       { _id: id, user_role: "doctor" },
//       updates,
//       { new: true }
//     );

//     if (!doctor) {
//       return res.status(404).json({ message: "Doctor not found" });
//     }

//     res.status(200).json({ message: "Doctor updated", doctor });
//   } catch (error) {
//     console.error("Error updating doctor:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };



export const updateDoctorByOrganisation = async (req: Request, res: Response):Promise<void> => {
  try {
    const doctorId = req.params.id;
    const updateData = req.body;

    const updatedDoctor = await User.findByIdAndUpdate(doctorId, updateData, { new: true });

    if (!updatedDoctor) {
      res.status(404).json({ message: "Doctor not found" });
      return 
    }

    res.json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ message: "Failed to update doctor", error });
  }
};

// Delete doctor
export const deleteDoctorByOrganisation = async (req: Request, res: Response):Promise<void> => {
  try {
    const doctorId = req.params.id;

    const deletedDoctor = await User.findByIdAndDelete(doctorId);

    if (!deletedDoctor) {
      res.status(404).json({ message: "Doctor not found" });
      return 
    }

    res.json({ message: "Doctor deleted", deleted: deletedDoctor });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete doctor", error });
  }
};
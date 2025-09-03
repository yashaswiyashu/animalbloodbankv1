import { Request, Response } from "express";
import { generateToken } from "../Utils/jwt.util";
import Farmer from "../models/farmer.model";
export const registerFarmer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { farmer_name, farmer_password, farmer_role, farmer_phone, farmer_city, farmer_taluk, farmer_district,farmer_state,farmer_country,farmer_pin_code } = req.body;
    console.log(req.body);
    
    const existingfarmer = await Farmer.findOne({ farmer_phone });
    if (existingfarmer) {
      res.status(400).json({ message: "farmer already exists" });
      return;
    }

    const farmer = await Farmer.create({
      farmer_name, farmer_password, farmer_role, farmer_phone, farmer_city, farmer_taluk, farmer_district,farmer_state,farmer_country,farmer_pin_code
    });

    res.status(201).json({ message: "Farmer Registration successful", farmer });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateFarmer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { farmerId } = req.params; // assuming farmerId is passed in the URL
    const { farmer_name, farmer_password, farmer_role, farmer_phone, farmer_city, farmer_taluk, farmer_district,farmer_state,farmer_country,farmer_pin_code } = req.body;

    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      res.status(404).json({ message: "Farmer not found" });
      return;
    }

    // Update the farmer fields
    farmer.farmer_name = farmer_name || farmer.farmer_name;
    farmer.farmer_password = farmer_password || farmer.farmer_password;
    farmer.farmer_role = farmer_role || farmer.farmer_role;
    farmer.farmer_phone = farmer_phone || farmer.farmer_phone;
    // farmer.farmer_address = farmer_address || farmer.farmer_address;
    farmer.farmer_city = farmer_city || farmer.farmer_city;
    farmer.farmer_taluk = farmer_taluk || farmer.farmer_taluk;
    farmer.farmer_district = farmer_district || farmer.farmer_district;
    farmer.farmer_state = farmer_state || farmer.farmer_state;
    farmer.farmer_country = farmer_country || farmer.farmer_country;
    farmer.farmer_pin_code = farmer_pin_code || farmer.farmer_pin_code;


    await farmer.save();

    res.status(200).json({ message: "Farmer updated successfully", farmer });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteFarmer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { farmerId } = req.params; // assuming farmerId is passed in the URL

    const farmer = await Farmer.findByIdAndDelete(farmerId);
    if (!farmer) {
      res.status(404).json({ message: "Farmer not found" });
      return;
    }

    res.status(200).json({ message: "Farmer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const loginFarmer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { farmer_phone, farmer_password } = req.body;
    const farmer = await Farmer.findOne({ farmer_phone });
    // console.log(farmer);
    
    if (!farmer) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await farmer.comparePassword(farmer_password);
    if (!isMatch){
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    const token = generateToken(farmer._id.toString(), farmer.farmer_role);

    // Set the token in a secure cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Ensure HTTPS in production
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.status(200).json({
      message: "Farmer Login successful",
      farmer: {
        id: farmer._id,
        farmer_name: farmer.farmer_name,
        farmer_phone: farmer.farmer_phone,
        farmer_role: farmer.farmer_role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

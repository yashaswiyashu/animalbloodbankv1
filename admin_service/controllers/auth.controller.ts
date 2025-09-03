import { Request, Response } from "express";
import User from "../models/user.model";
import { generateToken } from "../Utils/jwt.util";
import Farmer from "../models/farmer.model";
import FormData from "form-data";
import fs from "fs";
import axios from "axios";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      user_name,
      user_email,
      user_password,
      user_role,
      user_phone,
      city,
      taluk,
      district,
      state,
      country,
      pin_code,
      specialization,
      govt_id,
      gst_number,
      organisation_id,
    } = req.body;

    const existingUser = await User.findOne({ user_email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const newUserData: any = {
      user_name,
      user_email,
      user_password,
      user_role,
      user_phone,
      city,
      taluk,
      district,
      state,
      country,
      pin_code,
    };

    if (user_role === "doctor") {
      if (req.file) {
        console.log("Recieved file:", req.file);
        try {
          const formData = new FormData();
          formData.append("file", fs.createReadStream(req.file.path));

          const mediaResponse = await axios.post(
            `${process.env.MEDIA_URL}?folder=auth`,
            formData,
            {
              headers: formData.getHeaders(),
            }
          );

          newUserData.govt_id_image = (mediaResponse as any).data.url;
          fs.unlinkSync(req.file.path);
        } catch (uploadErr) {
          console.error("File upload to media service failed", uploadErr);
          res.status(500).json({ message: "Media service upload error" });
          return;
        }
      }

      if (specialization) newUserData.specialization = specialization;
      if (govt_id) newUserData.govt_id = govt_id;
      if (req.body.hospital_id) newUserData.hospital_id = req.body.hospital_id;
    }

    if (["doctor", "hospital"].includes(user_role) && organisation_id) {
      newUserData.organisation_id = organisation_id;
    }

    if (user_role === "lab" && gst_number) {
      newUserData.gst_number = gst_number;
    }

    const user = await User.create(newUserData);

    res.status(201).json({
      message: `${user_role} Registration successful`,
      user,
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params; // assuming userId is passed in the URL
    const { user_name, user_email, user_password, user_role, user_phone, city, taluk, district, state, country, pin_code, approved  } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Update the user fields
    user.user_name = user_name || user.user_name;
    user.user_email = user_email || user.user_email;
    user.user_password = user_password || user.user_password;
    user.user_role = user_role || user.user_role;
    user.user_phone = user_phone || user.user_phone;
    // user.user_address = user_address || user.user_address;
    user.city = city || user.city;
    user.taluk = taluk || user.taluk;
    user.district = district || user.district;
    user.state = state || user.state;
    user.country = country || user.country;
    user.pin_code = pin_code || user.pin_code;
    user.approved = approved || user.approved;
    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params; // assuming userId is passed in the URL

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const getUsersByRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role } = req.params;

    let users;

    if (role.toLowerCase() === "farmer") {
      users = await Farmer.find();
    } else {
      users = await User.find({ user_role: role });
    }
    console.log(users);
    
    if (!users || users.length === 0) {
      res.status(404).json({ message: `No users found for role: ${role}` });
      return;
    }

    res.status(200).json({
      message: `Users fetched successfully for role: ${role}`,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const getDoctors = async (req: Request, res: Response): Promise<void> => {
  try {
    // const { role } = req.params;

    let users = await User.find({ user_role: "doctor" });

    if (!users || users.length === 0) {
      res.status(404).json({ message: `No users found for role: doctor` });
      return;
    }

    res.status(200).json({
      message: `Users fetched successfully for role: doctor`,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_email, user_password } = req.body;
    const user = await User.findOne({ user_email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await user.comparePassword(user_password);
    if (!isMatch){
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    const token = generateToken(user._id.toString(), user.user_role);

    // Set the token in a secure cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Ensure HTTPS in production
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.status(200).json({
      message: `${user.user_role} Login successful`,
      user: {
        id: user._id,
        user_name: user.user_name,
        user_email: user.user_email,
        user_role: user.user_role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const logout = (req: Request, res: Response): void => {
  try {
    // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS in production
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
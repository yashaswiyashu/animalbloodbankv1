import { Request, Response } from "express";
import User from "../models/user.model";

export const getHospitals = async (req: Request, res: Response) => {
  try {
    const hospitals = await User.find({ user_role: "hospital" }); // adjust collection name if different
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch hospitals" });
  }
};


export const getOrganisations = async (req: Request, res: Response) => {
  try {
    const organisations = await User.find({ user_role: "organisation" });
    res.json(organisations);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch organisations" });
  }
};

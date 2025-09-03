import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { IFarmer } from "../interfaces/farmer/farmer.interface";

const farmerSchema = new mongoose.Schema<IFarmer>({
  farmer_name: { type: String, required: true },
  farmer_phone: { type: String, required: true, unique: true },
  // farmer_address: { type: String, required: true},
  farmer_city: {type: String, required: true},
  farmer_taluk: {type: String, required: true},
  farmer_district: {type: String, required: true},
  farmer_state: {type: String, required: true},
  farmer_country: {type: String, required: true},
  farmer_pin_code: {type: String, required: true},
  farmer_password: { type: String, required: true },
  farmer_role: {
    type: String,
    enum: ["farmer"],
    required: true,
  },
});

// Hash password before save
farmerSchema.pre("save", async function (next) {
  const farmer = this;
  if (!farmer.isModified("farmer_password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    farmer.farmer_password = await bcrypt.hash(farmer.farmer_password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

// Compare password method
farmerSchema.methods.comparePassword = function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.farmer_password);
};

const Farmer = mongoose.model("farmer", farmerSchema);
export default Farmer;

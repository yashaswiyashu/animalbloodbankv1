import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "../interfaces/user/user.Interface";

const userSchema = new mongoose.Schema<IUser>({
  user_name: { type: String, required: true },
  user_phone: { type: String, required: true, unique: true },
  user_email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
    unique: true,
  },
  // user_address: { type: String, required: true},
  city: {type: String, required: true},
  taluk: {type: String, required: true},
  district: {type: String, required: true},
  state: {type: String, required: true},
  country: {type: String, required: true},
  pin_code: {type: String, required: true},
  user_password: { type: String, required: true },
  user_role: {
    type: String,
    enum: ["admin", "doctor", "hospital", "pharmacy", "lab", "organisation", "vendor", "Animal Enthusiasts"],
    required: true,
  },
  specialization: { type: String},
  govt_id: { type: String },           // Only for doctors
  govt_id_image: { type: String },      // Only for doctors (image path)
  gst_number: { type: String },
  organisation_id: { type: String},
  hospital_id: { type: String},         // for doctors
  // hospital_name: { type: String},       // for organisation
  approved: { type: Boolean, default: false },
});

// Hash password before save
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("user_password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    user.user_password = await bcrypt.hash(user.user_password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.user_password);
};

const User = mongoose.model("User", userSchema);
export default User;

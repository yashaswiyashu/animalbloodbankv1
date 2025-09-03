import mongoose from "mongoose";

const animalSchema = new mongoose.Schema({
  farmerId: { type: String, required: true },
  type: { type: String, required: true },
  species: { type: String, required: true },
  breed: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  bloodGroup: { type: String },
  // location: { type: String, required: true },
  city: { type: String, required: true },
  taluk: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  pin_code: { type: String, required: true },
  praniAadharNumber: { type: String, required: true, unique: true },
  animalImage: {type: String, required: true}
});

export const AnimalModel = mongoose.model("Animal", animalSchema);

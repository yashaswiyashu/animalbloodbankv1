import { Request, Response } from "express";
import { AddAnimalByAdminReq, AddAnimalReq } from "../interfaces/animal/animal.reqType";
import { AnimalModel } from "../models/animal.model";
import { generatePraniAadhar } from "../Utils/idGenerator.util";
import { UpdateAnimalReq } from "../interfaces/animal/animalUpdate.reqType";
import fs from "fs";
import FormData from "form-data"
import axios from "axios";

// export const addAnimal = async (req: AddAnimalReq, res: Response) => {
//   try {
//     const { type, species, breed,name, age, bloodGroup, city, taluk, district, state, country, pin_code, } = req.body;
//     const farmerId = req.user.id; // assuming middleware adds user to req

//     const praniAadharNumber = generatePraniAadhar(
//       species, breed, age, city
//     );

//     const newAnimal = new AnimalModel({
//       farmerId,
//       type,
//       species,
//       breed,
//       name,
//       age,
//       bloodGroup,
//       city,
//       taluk,
//       district,
//       state,
//       country,
//       pin_code,
//       praniAadharNumber,
//     });

//     await newAnimal.save();

//     res.status(201).json({
//       message: "Animal registered successfully",
//       praniAadharNumber,
//       animal: newAnimal,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to register animal", error });
//   }
// };


export const addAnimal = async (req: AddAnimalReq, res: Response) => {
  try {
    const {
      type, species, breed, name, age,
      bloodGroup, city, taluk, district,
      state, country, pin_code
    } = req.body;

    const farmerId = req.user.id;

    const praniAadharNumber = await generatePraniAadhar(
      species,
      breed,
      age,
      pin_code,  // <-- pass actual pin_code
      state      // <-- pass actual state
    );

    console.log("Generated Prani Aadhar:", praniAadharNumber  );
    

    const newAnimalData: any = {
      farmerId,
      type,
      species,
      breed,
      name,
      age,
      bloodGroup,
      city,
      taluk,
      district,
      state,
      country,
      pin_code,
      praniAadharNumber,
    };
    console.log("i am here");
    

    // ⬇️ Image Upload to Media Service
    if (req.file) {
      const formData = new FormData();
      formData.append("file", fs.createReadStream(req.file.path));

      const mediaRes = await axios.post(
        `${process.env.MEDIA_URL}?folder=animals`,
        formData,
        {
          headers: formData.getHeaders(),
        }
      );

      newAnimalData.animalImage = (mediaRes as any).data.url;

      // Delete temp file after upload
      fs.unlinkSync(req.file.path);
    }

    const newAnimal = new AnimalModel(newAnimalData);
    await newAnimal.save();

    res.status(201).json({
      message: "Animal registered successfully",
      praniAadharNumber,
      animal: newAnimal,
    });
  } catch (error) {
    console.error("Animal registration error:", error);
    res.status(500).json({
      message: "Failed to register animal",
      error,
    });
  }
};




export const addAnimalByAdmin = async (req: AddAnimalByAdminReq, res: Response) => {
  try {
    const { farmerId,type, species, breed, name, age, bloodGroup, city, taluk, district, state, country, pin_code,animalImage } = req.body;

    if (!farmerId) {
      res.status(400).json({ message: "Farmer ID is required" });
      return;
    }

    const praniAadharNumber = await generatePraniAadhar(
      species,
      breed,
      age,
      pin_code,  // <-- pass actual pin_code
      state      // <-- pass actual state
    );

    const newAnimal = new AnimalModel({
      farmerId,
      type,
      species,
      breed,
      name,
      age,
      bloodGroup,
      city,
      taluk,
      district,
      state,
      country,
      pin_code,
      praniAadharNumber,
      animalImage,
    });

    await newAnimal.save();

    res.status(201).json({
      message: "Animal registered successfully under farmer",
      praniAadharNumber,
      animal: newAnimal,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to register animal", error });
  }
};

// export const updateAnimal = async (req: UpdateAnimalReq, res: Response): Promise<void> => {
//   try {
//     const farmerId = req.user.id;
//     const { praniAadharNumber } = req.params;

//     const updateFields = req.body;

//     const updatedAnimal = await AnimalModel.findOneAndUpdate(
//       { farmerId, praniAadharNumber },
//       { $set: updateFields },
//       { new: true }
//     );

//     if (!updatedAnimal) {
//       res.status(404).json({
//         message: "Animal not found or you are not authorized to update it.",
//       });
//       return;
//     }

//     res.status(200).json({
//       message: "Animal information updated successfully.",
//       animal: updatedAnimal,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to update animal information.",
//       error,
//     });
//   }
// };

export const updateAnimal = async (req: UpdateAnimalReq, res: Response): Promise<void> => {
  try {
    const farmerId = req.user.id;
    const { praniAadharNumber } = req.params;

    const updateFields: any = req.body;

    // ⬇️ Handle image update
    if (req.file) {
      const formData = new FormData();
      formData.append("file", fs.createReadStream(req.file.path));

      const mediaRes = await axios.post(
        `${process.env.MEDIA_URL}?folder=animals`,
        formData,
        {
          headers: formData.getHeaders(),
        }
      );

      updateFields.animalImage = (mediaRes as any).data.url;

      // Remove temp file
      fs.unlinkSync(req.file.path);
    }

    const updatedAnimal = await AnimalModel.findOneAndUpdate(
      { farmerId, praniAadharNumber },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedAnimal) {
      res.status(404).json({
        message: "Animal not found or you are not authorized to update it.",
      });
      return;
    }

    res.status(200).json({
      message: "Animal information updated successfully.",
      animal: updatedAnimal,
    });
  } catch (error) {
    console.error("Animal update error:", error);
    res.status(500).json({
      message: "Failed to update animal information.",
      error,
    });
  }
};

export const editAnimalByAdmin = async (req: UpdateAnimalReq, res: Response): Promise<void> => {
  try {
    const { animalId } = req.params;
    const updateData = req.body;

    const animal = await AnimalModel.findById(animalId);

    if (!animal) {
      res.status(404).json({ message: "Animal not found" });
      return;
    }

    // Update animal details
    Object.assign(animal, updateData);

    await animal.save();

    res.status(200).json({
      message: "Animal details updated successfully",
      animal,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update animal", error });
  }
};

export const getFarmerAnimals = async (req: AddAnimalReq, res: Response) => {
  try {
    const farmerId = req.user.id; // assuming auth middleware injects the logged-in farmer

    const animals = await AnimalModel.find({ farmerId });

    res.status(200).json({
      message: "Animals fetched successfully",
      animals,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch animals", error });
  }
};

export const getFarmerAnimalsByAdmin = async (req: AddAnimalReq, res: Response): Promise<void> => {
  try {
    const { farmerId } = req.params;  // Admin provides the farmerId in URL params

    // Fetch the animals associated with the given farmerId
    const animals = await AnimalModel.find({ farmerId });

    if (animals.length === 0) {
      res.status(404).json({ message: "No animals found for this farmer" });
      return;
    }

    res.status(200).json({
      message: "Animals fetched successfully",
      animals,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch animals", error });
  }
};



export const deleteAnimal = async (req: AddAnimalReq, res: Response): Promise<void> => {
  try {
    const farmerId = req.user.id;
    const { praniAadharNumber } = req.params;

    const deletedAnimal = await AnimalModel.findOneAndDelete({
      farmerId,
      praniAadharNumber,
    });

    if (!deletedAnimal) {
       res.status(404).json({
        message: "Animal not found or you are not authorized to delete it.",
      });
      return;
    }

    res.status(200).json({
      message: "Animal deleted successfully.",
      deletedAnimal,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete animal.",
      error,
    });
  }
};

export const deleteAnimalByAdmin = async (req: AddAnimalReq, res: Response): Promise<void> => {
  try {
    const { animalId } = req.params;

    const animal = await AnimalModel.findById(animalId);

    if (!animal) {
      res.status(404).json({ message: "Animal not found" });
      return;
    }

    await AnimalModel.findByIdAndDelete(animalId);

    res.status(200).json({ message: "Animal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete animal", error });
  }
};


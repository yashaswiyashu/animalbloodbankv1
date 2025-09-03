import express from "express";
import { addAnimal, addAnimalByAdmin, deleteAnimal, deleteAnimalByAdmin, editAnimalByAdmin, getFarmerAnimals, getFarmerAnimalsByAdmin, updateAnimal } from "../controllers/animal.controller";
import { authorizeRoleFarmer, authorizeRoles, protect, protectFarmer } from "../middlewares/auth.middleware";
// import { getAnimalsByPraniAadhar } from '../controllers/animal.controller';
import { upload } from '../middlewares/upload.middleware'; // 👈 import multer


const router = express.Router();

router.post("/add", protectFarmer, authorizeRoleFarmer("farmer"), upload.single('animalImage'), addAnimal);
router.get("/get-animals", protectFarmer, authorizeRoleFarmer("farmer"), getFarmerAnimals);
router.delete("/:praniAadharNumber", protectFarmer,authorizeRoleFarmer("farmer"), deleteAnimal);
router.put("/update/:praniAadharNumber", protectFarmer, authorizeRoleFarmer("farmer"),upload.single('animalImage'), updateAnimal);


export default router;

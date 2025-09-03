import express from "express";
import { addAnimal, addAnimalByAdmin, deleteAnimal, deleteAnimalByAdmin, editAnimalByAdmin, getFarmerAnimals, getFarmerAnimalsByAdmin, updateAnimal } from "../controllers/animal.controller";
import { authorizeRoleFarmer, authorizeRoles, protect, protectFarmer } from "../middlewares/auth.middleware";
// import { getAnimalsByPraniAadhar } from '../controllers/animal.controller';

const router = express.Router();

router.post("/addByAdmin", protect, authorizeRoles("admin"), addAnimalByAdmin);
router.get("/get-animals-admin/:farmerId", protect, authorizeRoles("admin"), getFarmerAnimalsByAdmin);
router.put("/admin/animals/:animalId", protect, authorizeRoles("admin"), editAnimalByAdmin);
router.delete("/admin/animals/:animalId", protect, authorizeRoles("admin"),  deleteAnimalByAdmin);
// router.get('/by-prani/:praniAadharNumber', getAnimalsByPraniAadhar);


export default router;

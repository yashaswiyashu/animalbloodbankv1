import express from "express";
import upload from "../middlewares/upload";
import { uploadImages, getImages, deleteImage,} from "../controllers/organisation.image.controller";
import { authorizeRoles, protect } from "../middlewares/auth.middleware";

const router = express.Router();

// Upload images
router.post("/upload", upload.array("images", 10), protect, authorizeRoles("organisation"), uploadImages);

// Get images (optionally filtered by organisation_id)
router.get("/images",protect,authorizeRoles("organisation", "Animal Enthusiasts"),  getImages);

// Delete image
router.delete("/image/:id",protect, authorizeRoles("organisation"), deleteImage);

export default router;

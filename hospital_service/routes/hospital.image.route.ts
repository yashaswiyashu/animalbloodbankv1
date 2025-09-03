// import express from "express";
// import upload from "../middlewares/upload";
// import Image from "../models/hospital.images";
// import path from "path";

// const router = express.Router();

// // Upload images using multer
// router.post("hospital/upload", upload.array("images", 10), async (req, res) => {
//   const files = req.files as Express.Multer.File[];
//   const imageDocs = files.map(file => ({
//     imageUrl: `/uploads/${file.filename}`,
//   }));
//   const savedImages = await Image.insertMany(imageDocs);
//   res.json(savedImages);
// });

// // Get all images
// router.get("/hospital/images", async (_req, res) => {
//   const images = await Image.find();
//   res.json(images);
// });

// // Delete image
// router.delete("hospital/image/:id", async (req, res) => {
//   const image = await Image.findByIdAndDelete(req.params.id);
//   res.json({ success: true, deleted: image });
// });

// export default router;



import express from "express";
import upload from "../middlewares/upload";
import { uploadImages, getImages, deleteImage } from "../controllers/hospital.image.controller";
import { authorizeRoles, protect } from "../middlewares/auth.middleware";


const router = express.Router();

// Upload images
router.post("/hospital/upload", upload.array("images", 10), protect,authorizeRoles("hospital"), uploadImages);

// Get images (optionally filtered by organisation_id)
router.get("/hospital/images",protect,authorizeRoles("hospital", "Animal Enthusiasts"), getImages);

// Delete image
router.delete("/hospital/image/:id", protect, authorizeRoles("hospital"), deleteImage);

export default router;

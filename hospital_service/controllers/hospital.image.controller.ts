import { Request, Response } from "express";
import HospitalImage from "../models/hospital.images";
import FormData from "form-data";
import fs from "fs";
import axios from "axios";
// Upload images
export const uploadImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    const hospitalId = req.body.hospital_id;

    if (!hospitalId) {
      res.status(400).json({ message: "Hospital ID is required" });
      return;
    }

    if (!files || files.length === 0) {
      res.status(400).json({ message: "No files uploaded" });
      return;
    }

    const uploadedImages: any[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", fs.createReadStream(file.path));

      const mediaResponse = await axios.post(
        `${process.env.MEDIA_URL}?folder=hospital`,
        formData,
        {
          headers: formData.getHeaders(),
        }
      );

      uploadedImages.push({
        imageUrl: (mediaResponse as any).data.url,  // url returned by media-service
        hospital_id: hospitalId,
      });

      // Optionally delete temp uploaded file from local storage
      fs.unlinkSync(file.path);
    }

    const savedImages = await HospitalImage.insertMany(uploadedImages);
    res.json({ message: "Images uploaded successfully", images: savedImages });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Error uploading images", error });
  }
};

// Get images (optionally filtered by organisation_id)
export const getImages = async (req: Request, res: Response) => {
  try {
    const { hospital_id } = req.query;
    const filter = hospital_id ? { hospital_id } : {};
    const images = await HospitalImage.find(filter);
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: "Error fetching images", error });
  }
};

// Delete image by ID
export const deleteImage = async (req: Request, res: Response):Promise<void> => {
  try {
    const image = await HospitalImage.findByIdAndDelete(req.params.id);
    if (!image) {
      res.status(404).json({ message: "Image not found" });
      return 
    }
    res.json({ success: true, deleted: image });
  } catch (error) {
    res.status(500).json({ message: "Error deleting image", error });
  }
};

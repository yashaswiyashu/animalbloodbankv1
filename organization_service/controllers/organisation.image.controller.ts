import { Request, Response } from "express";
import Image from "../models/organisation.image";
import FormData from "form-data";
import fs from "fs";
import axios from "axios";

// Upload images
export const uploadImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    const organisationId = req.body.organisation_id;

    if (!organisationId) {
      res.status(400).json({ message: "Organisation ID is required" });
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
        `${process.env.MEDIA_URL}?folder=organisation`,
        formData,
        {
          headers: formData.getHeaders(),
        }
      );

      uploadedImages.push({
        imageUrl: (mediaResponse as any).data.url,  // from media-service response
        organisation_id: organisationId,
      });

      // Optional: delete local temp file after upload
      fs.unlinkSync(file.path);
    }

    const savedImages = await Image.insertMany(uploadedImages);
    res.json({ message: "Images uploaded successfully", images: savedImages });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Error uploading images", error });
  }
};

// Get images (optionally filtered by organisation_id)
export const getImages = async (req: Request, res: Response) => {
  try {
    const { organisation_id } = req.query;
    const filter = organisation_id ? { organisation_id } : {};
    const images = await Image.find(filter);
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: "Error fetching images", error });
  }
};

// Delete image by ID
export const deleteImage = async (req: Request, res: Response):Promise<void> => {
  try {
    const image = await Image.findByIdAndDelete(req.params.id);
    if (!image) {
      res.status(404).json({ message: "Image not found" });
      return 
    }
    res.json({ success: true, deleted: image });
  } catch (error) {
    res.status(500).json({ message: "Error deleting image", error });
  }
};

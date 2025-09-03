import { Request, Response } from "express";

export const uploadFile = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  console.log("Uploaded file:", req.file);

  // Retrieve folder from body — fallback to 'others' if not provided
  const folder = req.query.folder || 'others';

  const fileUrl = `/uploads/${folder}/${req.file.filename}`;

  res.status(200).json({
    message: "File uploaded successfully",
    url: fileUrl
  });
};
import express from "express";
import upload from "../middleware/upload";
import { uploadFile } from "../controllers/media.controller";

const router = express.Router();

// POST /api/media/upload
router.post("/upload", upload.single("file"), uploadFile);

export default router;

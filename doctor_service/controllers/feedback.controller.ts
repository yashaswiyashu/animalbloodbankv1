import { Request, Response } from 'express';
import Feedback from '../models/feedbacks';
import FormData from "form-data";
import fs from "fs";
import axios from "axios";

export const submitFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { farmerName , praniAadharNumber, description } = req.body;
    const file = req.file;
    let filePath: string;

    if ( !description || !file) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    if (req.file) {
      // Forward file to media service
      const formData = new FormData();
      formData.append("file", fs.createReadStream(req.file.path));

      const mediaResponse = await axios.post(
        `${process.env.MEDIA_URL}?folder=feedback`,
        formData,
        {
          headers: formData.getHeaders(),
        }
      );

      filePath = (mediaResponse as any).data.url;

      fs.unlinkSync(req.file.path);
      
      const feedback = new Feedback({
        farmerName,
        praniAadharNumber,
        description,
        filePath: filePath,
        originalFileName: file.originalname,
      });
  
      await feedback.save();
    }
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



export const getFeedbackByPraniAadhar = async (req: Request, res: Response): Promise<void> => {
  try {
    const { praniAadharNumber } = req.params;

    const feedbackList = await Feedback.find({ praniAadharNumber });

    if (!feedbackList || feedbackList.length === 0) {
      res.status(404).json({ message: 'No feedback found' });
      return;
    }

    const formattedFeedback = feedbackList.map(feedback => ({
      description: feedback.description,
      fileUrl: feedback.filePath,       // assuming this is a URL or path to the file
      originalFileName: feedback.originalFileName,
    }));

    res.status(200).json(formattedFeedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


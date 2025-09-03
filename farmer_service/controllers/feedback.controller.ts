import { Request, Response } from 'express';
import Feedback from '../models/feedbacks';

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

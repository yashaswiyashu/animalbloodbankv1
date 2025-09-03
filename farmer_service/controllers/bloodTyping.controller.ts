import { Request, Response } from 'express';
import BloodTypingRequest from '../models/bloodtypingreq.model';

// POST /bloodtyping/request
export const createRequest = async (req: Request, res: Response):Promise<void> => {
  try {
    const {
      labId,
      species,
      breed,
      age,
      location,
      
    } = req.body;

    // Basic validation
    if (!labId || !species || !breed || !age || !location) {
      res.status(400).json({ message: 'All fields are required' });
      return 
    }

    const newRequest = await BloodTypingRequest.create({
      labId,
      species,
      breed,
      age,
      location,
    });

    res.status(201).json({ message: 'Blood typing request created', request: newRequest });
  } catch (err) {
    console.error('Error creating blood typing request:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /bloodtyping/lab/:labId
export const getLabRequests = async (req: Request, res: Response):Promise<void> => {
  try {
    const { labId } = req.params;

    if (!labId) {
      res.status(400).json({ message: 'Lab ID is required' });
      return 
    }

    const requests = await BloodTypingRequest.find({ labId }).sort({ requestedAt: -1 });

    res.status(200).json({ requests });
  } catch (err) {
    console.error('Error fetching lab requests:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

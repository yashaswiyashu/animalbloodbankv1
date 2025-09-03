// donor.controller.ts
import { Request, Response } from 'express';
import Donor from '../models/donor.model';

export const addDonor = async (req: Request, res: Response) => {
    try {
        const {
            praniAadharNumber,
            weight,
            species,
            breed,
            age,
            bloodGroup,
            location,
            healthDescription,
            healthFileUrl,
        } = req.body;

        const image = req.file ? req.file.filename : req.body.imageUrl || '';

        const newDonor = new Donor({
            praniAadharNumber,
            weight,
            species,
            breed,
            age,
            bloodGroup,
            location,
            image,
            healthRecord: {
                description: healthDescription,
                fileUrl: healthFileUrl,
            }
        });

        await newDonor.save();

        res.status(201).json({ message: 'Donor added successfully' });
    } catch (err) {
        console.error('Add donor error:', err);
        res.status(500).json({ message: 'Failed to add donor' });
    }
};

export const getAllDonors = async (req: Request, res: Response) => {
    try {
        const donors = await Donor.find().sort({ createdAt: -1 }); // newest first
        res.status(200).json(donors);
    } catch (err) {
        console.error('Error fetching donors:', err);
        res.status(500).json({ message: 'Failed to fetch donors' });
    }
};

export const updateDonorStatus = async (req: Request, res: Response):Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Accepted', 'Rejected'].includes(status)) {
      res.status(400).json({ message: 'Invalid status value' });
      return 
    }

    const updated = await Donor.findByIdAndUpdate(id, { status }, { new: true });

    if (!updated) {
      res.status(404).json({ message: 'Donor not found' });
      return 
    }

    res.status(200).json({ message: 'Status updated', donor: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update status' });
  }
};


export const getAcceptedDonorsBySpecies = async (req: Request, res: Response): Promise<void> => {
  try {
    const { species } = req.query;

    // Base query: only accepted donors
    const query: any = { status: 'Accepted' };

    // Add species filter if provided
    if (species) {
      query.species = species;
    }

    const donors = await Donor.find(query);
    res.status(200).json(donors);
  } catch (error) {
    console.error('Error fetching accepted donors:', error);
    res.status(500).json({ message: 'Server error fetching donors' });
  }
};


export const getDonorById = async (req: Request, res: Response):Promise<void> => {
  try {
    const { id } = req.params;

    const donor = await Donor.findById(id);
    if (!donor) {
      res.status(404).json({ message: 'Donor not found' });
      return 
    }

    // Only send relevant fields (not internal MongoDB fields)
    res.status(200).json({
      praniAadharNumber: donor.praniAadharNumber,
      species: donor.species,
      breed: donor.breed,
      age: donor.age,
      bloodGroup: donor.bloodGroup,
      location: donor.location,
    });

  } catch (error) {
    console.error('Error fetching donor by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

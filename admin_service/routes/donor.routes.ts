// donor.routes.ts
import express from 'express';
import { addDonor, getAllDonors, updateDonorStatus, getAcceptedDonorsBySpecies,getDonorById } from '../controllers/donor.controller';
import upload from '../middlewares/upload'; // reuse your existing multer config

const router = express.Router();

router.post('/add', upload.single('image'), addDonor);
router.get('/all', getAllDonors);
router.put('/status/:id', updateDonorStatus);
router.get('/accepted', getAcceptedDonorsBySpecies);
router.get('/by-id/:id', getDonorById);


export default router;

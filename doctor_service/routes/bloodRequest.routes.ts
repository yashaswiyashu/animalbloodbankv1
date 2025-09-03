import express from 'express';
import { createBloodRequest, getAllBloodRequests, assignMatchedDonors,getMatchedBloodRequests} from '../controllers/bloodRequest.controller';
import {upload} from '../middlewares/upload.middleware'; // multer setup to handle images

const router = express.Router();

router.post('/add', upload.single('image'), createBloodRequest);
router.get('/all', getAllBloodRequests);
router.post('/assign-match/:id', assignMatchedDonors);
router.get('/matched', getMatchedBloodRequests);

export default router;

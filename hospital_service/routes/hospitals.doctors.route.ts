import express from 'express';
import { getDoctorsByHospitalId,updateDoctor, deleteDoctor, } from '../controllers/hospitals.doctors';
import upload from '../middlewares/upload';
import { authorizeRoles, protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.get('/doctors/hospital/:hospitalId', getDoctorsByHospitalId);
router.put('/update/:id', upload.single('govt_id_image'), updateDoctor);
router.delete('/delete/:id',protect,authorizeRoles("hospital"), deleteDoctor);

export default router;

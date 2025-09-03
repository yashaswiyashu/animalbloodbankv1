import express from "express";
import { getOrgHospitals , updateHospital, deleteHospitalByOrganisation,deleteDoctorByOrganisation,updateDoctorByOrganisation, getDoctorsByOrganisation } from "../controllers/organisation.hospital.controller";
import { authorizeRoleFarmer, authorizeRoles, protect, protectFarmer } from "../middlewares/auth.middleware";
import upload from '../middlewares/upload';

// import { getAnimalsByPraniAadhar } from '../controllers/animal.controller';

const router = express.Router();

router.get("/get-hospitals/:organisation_id", getOrgHospitals);
// router.get("/get-hospitals/:organisation_id",protect,authorizeRoles("admin"), getOrgHospitals);
router.put('/update-hospital/:id', updateHospital);
router.delete("/delete-hospital/:id", deleteHospitalByOrganisation);
router.get('/doctors/by-org/:orgId', getDoctorsByOrganisation);
router.put('/update-doctor/:id', upload.single('govt_id_image'), protect,authorizeRoles("organisation"), updateDoctorByOrganisation);
router.delete('/delete-doctor/:id', deleteDoctorByOrganisation);


export default router;
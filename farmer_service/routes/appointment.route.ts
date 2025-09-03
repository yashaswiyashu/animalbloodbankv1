import express from "express";
import { authorizeRoleFarmer, protectFarmer } from "../middlewares/auth.middleware";
import { bookAppointment, getAppointmentsByDate, getAppointmentsByFarmer, cancelAppointment, completeAppointment} from "../controllers/appointment.controller";

const router = express.Router();


router.post("/book", protectFarmer, authorizeRoleFarmer("farmer"), bookAppointment);
router.get("/:doctorId/:start_date", protectFarmer, authorizeRoleFarmer("farmer"), getAppointmentsByDate);
router.get('/appointments/farmer/:farmerId', protectFarmer, authorizeRoleFarmer("farmer"), getAppointmentsByFarmer);
router.put('/:id/cancel', protectFarmer, authorizeRoleFarmer("farmer"), cancelAppointment);
router.put("/complete/:id", protectFarmer, authorizeRoleFarmer("farmer"), completeAppointment);


export default router;



import express from "express";
import { authorizeRoles, protect } from "../middlewares/auth.middleware";
import { bookAppointment, completeAppointment, getAppointmentsByDate, getAppointmentsByDoctor, cancelAppointment} from "../controllers/appointment.controller";

const router = express.Router();


router.post("/book", protect, authorizeRoles("doctor"), bookAppointment);
router.get("/:doctorId/:start_date", protect, authorizeRoles("doctor"), getAppointmentsByDate);
router.get("/:doctorId", protect, authorizeRoles("doctor"), getAppointmentsByDoctor);
router.put("/complete/:id", protect, authorizeRoles("doctor"), completeAppointment);
router.put('/:id/cancel', protect, authorizeRoles("doctor"), cancelAppointment);



export default router;



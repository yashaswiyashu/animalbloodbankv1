import { Router } from 'express';
import { getHospitals, getOrganisations } from '../controllers/hospital.enthusiast';
import { authorizeRoles, protect} from "../middlewares/auth.middleware";

const router = Router();

router.get('/hospitals', getHospitals);
router.get('/organisations', getOrganisations);


export default router;
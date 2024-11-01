import express from 'express'
import { enterMc, exitMc, viewTrafficStatus, viewHistory, viewUserAccess ,updateDoctorAvailability ,getDoctorAvailability } from '../controllers/medi.controller.js';

const router = express.Router();

router.post('/enter', enterMc);
router.post('/exit', exitMc);
router.post('/status', viewTrafficStatus);
router.get('/history', viewHistory);
router.post('/useraccess', viewUserAccess);
router.get('/doctor-availability', getDoctorAvailability);
router.put('/doctor-availability', updateDoctorAvailability);


export default router;
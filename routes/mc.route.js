import express from 'express'
import { enterMc, exitMc, viewTrafficStatus, viewHistory, viewUserAccess } from '../controllers/medi.controller.js';

const router = express.Router();

router.post('/enter', enterMc);
router.post('/exit', exitMc);
router.post('/status', viewTrafficStatus);
router.get('/history', viewHistory);
router.post('/useraccess', viewUserAccess);

export default router;
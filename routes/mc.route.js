import express from 'express'
import { enterMc, exitMc, viewTrafficStatus } from '../controllers/medi.controller.js';

const router = express.Router();

router.post('/enter', enterMc);
router.post('/exit', exitMc);
router.get('/status', viewTrafficStatus);

export default router;
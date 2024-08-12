import express from 'express';
import { reportStatus, viewStatus } from '../controllers/canteenController.js';

const router = express.Router();

router.post('/report', reportStatus);

router.post('/status', viewStatus);

export default router;

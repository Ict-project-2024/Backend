import express from 'express';
import { reportStatus, viewStatus } from '../controllers/canteenController.js';
import { verifyUser , verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

router.post('/report',verifyToken, reportStatus);

router.get('/status', viewStatus);

export default router;

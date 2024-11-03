import express from 'express';
import { getUserNotifications } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', getUserNotifications);

export default router;
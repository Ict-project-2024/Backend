import express from 'express';
import { getUserNotifications , markNotificationAsRead } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', getUserNotifications);
router.patch('/:notificationId', markNotificationAsRead);

export default router;
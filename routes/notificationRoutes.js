import express from 'express';
import { getUserNotifications , markNotificationAsRead } from '../controllers/notificationController.js';

const router = express.Router();

router.post('/', getUserNotifications);
router.get('/:notificationId', markNotificationAsRead);

export default router;
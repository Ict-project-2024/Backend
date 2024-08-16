import express from 'express'
import { enterLibrary, exitLibrary, viewTrafficStatus, viewHistory, viewUserAccess } from '../controllers/Lib.controller.js';

const router = express.Router();

router.post('/enter', enterLibrary);
router.post('/exit', exitLibrary);
router.post('/status', viewTrafficStatus);
router.get('/history', viewHistory);
router.post('/useraccess', viewUserAccess);

export default router;
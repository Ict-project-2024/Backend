import express from 'express'
import { enterLibrary, exitLibrary, viewTrafficStatus, viewHistory } from '../controllers/Lib.controller.js';

const router = express.Router();

router.post('/enter', enterLibrary);
router.post('/exit', exitLibrary);
router.post('/status', viewTrafficStatus);
router.get('/history', viewHistory);

export default router;
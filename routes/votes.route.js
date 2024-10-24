import express from 'express'
import { getUserVotes, getAllVotes } from '../controllers/votes.controller.js';

const router = express.Router();

router.post('/get', getUserVotes);

router.get('/all', getAllVotes);

export default router;
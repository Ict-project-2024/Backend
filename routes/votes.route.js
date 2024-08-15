import express from 'express'
import { getUserVotes } from '../controllers/votes.controller.js';

const router = express.Router();

router.post('/get', getUserVotes);

export default router;
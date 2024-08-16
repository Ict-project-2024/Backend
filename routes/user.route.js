import express from 'express'
import { retrieveUsers } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/', retrieveUsers);

export default router;
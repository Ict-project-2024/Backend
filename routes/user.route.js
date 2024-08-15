import express from 'express'
import { retrieveUsers } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/all', retrieveUsers);

export default router;
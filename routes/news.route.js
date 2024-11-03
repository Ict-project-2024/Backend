import express from 'express';
import { createNews, getNews } from '../controllers/news.controller.js';

const router = express.Router();

router.post('/create', createNews);
router.get('/getall', getNews);

export default router;
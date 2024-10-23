import express from 'express'
import { generateSasToken } from '../controllers/azureBlobController.js';


const router = express.Router();

router.get('/genarate', generateSasToken);


export default router;
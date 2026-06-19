import express from 'express';
import { processDigest } from '../controllers/digestController.js';

const router = express.Router();

router.post('/digest', processDigest);

export default router;
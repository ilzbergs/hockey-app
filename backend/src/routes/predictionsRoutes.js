import express from 'express';
import authenticate from '../middleware/authToken.js';
import { savePredictions, getPredictions, getAllUserPredictions } from '../controllers/predictionController.js';

const router = express.Router();

router.post('/', authenticate, savePredictions);

router.get('/', authenticate, getPredictions);

router.get('/all', authenticate, getAllUserPredictions);

export default router;
import express from 'express';
import authenticate from '../middleware/authToken';
import { savePredictions, getPredictions, getAllUserPredictions } from '../controllers/predictionController';

const router = express.Router();

router.post('/', authenticate, savePredictions);

router.get('/', authenticate, getPredictions);

router.get('/all', authenticate, getAllUserPredictions);

export default router;
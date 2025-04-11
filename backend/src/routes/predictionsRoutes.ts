import express from 'express';
import authenticate from '../middleware/authToken';
import {
  savePredictions,
  getPredictions,
  getAllUserPredictions,
} from '../controllers/predictionController';

const router = express.Router();

router.post('/', savePredictions);

router.get('/', getPredictions);

router.get('/all', getAllUserPredictions);

export default router;

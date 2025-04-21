import express from 'express';
import { checkAuth } from '../middleware/authenticate';
import {
  savePredictions,
  getPredictions,
  getAllUserPredictions,
} from '../controllers/predictionController';

const router = express.Router();

router.post('/',checkAuth,  savePredictions);
router.get('/',checkAuth,  getPredictions);
router.get('/all',checkAuth,  getAllUserPredictions);

export default router;

import express from 'express';
import authenticate from '../middleware/authToken';

import { getGames, updateGameScore } from '../controllers/gameController';

const router = express.Router();
 
router.get('/', getGames);

router.post('/update-score', updateGameScore);

export default router;
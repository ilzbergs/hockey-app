import express from 'express';
import authenticate from '../middleware/authToken';

import { getGames, updateGameScore } from '../controllers/gameController';

const router = express.Router();
 
router.get('/', authenticate, getGames);

router.post('/update-score', authenticate, updateGameScore);

export default router;
import express from 'express';
import authenticate from '../middleware/authToken.js';

import { getGames, updateGameScore } from '../controllers/gameController.js';

const router = express.Router();
 
router.get('/', authenticate, getGames);

router.post('/update-score', authenticate, updateGameScore);

export default router;
import express from 'express';
import { checkAuth } from '../middleware/authenticate';
import { getGames, updateGameScore } from '../controllers/gameController';

const router = express.Router();

router.get('/', checkAuth, getGames);
router.post('/update-score', checkAuth, updateGameScore);

export default router;

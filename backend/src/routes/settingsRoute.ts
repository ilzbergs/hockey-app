import { Router } from 'express';
import { getSettings } from '../controllers/settingsController';
import { checkAuth } from '../middleware/authenticate';

const router = Router();

router.get('/',checkAuth, getSettings);

export default router;

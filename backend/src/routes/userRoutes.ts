import express from 'express';
import authenticate from '../middleware/authToken';

import { getUser, createUser,  } from '../controllers/userController';

const router = express.Router();

// Route for registering a new user
// Calls the createUser controller to handle user registration
router.post('/register', createUser);

// Route for getting the details of the authenticated user
// Calls the getUser controller to fetch user data
router.get('/', authenticate, getUser);

export default router;

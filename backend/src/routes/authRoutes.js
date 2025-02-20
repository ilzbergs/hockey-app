import express from 'express';
import { login, logout } from '../controllers/authController.js';

const router = express.Router();

// Route for logging in a user
router.post('/login', login);

// Route for logging out a user
router.post('/logout', logout);

export default router;

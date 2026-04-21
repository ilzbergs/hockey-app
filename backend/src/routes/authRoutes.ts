import express from 'express';
import {
  login,
  logout,
  requestPasswordReset,
  resetPassword
} from '../controllers/authController';

const router = express.Router();

// Route for logging in a user
router.post('/login', login);

// Route for logging out a user
router.post('/logout', logout);

// Route for requesting a password reset
router.post('/request-password-reset', requestPasswordReset);

// Route for resetting the password using a token
router.post('/reset-password', resetPassword);


export default router;

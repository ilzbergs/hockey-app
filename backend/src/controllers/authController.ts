import jwt from 'jsonwebtoken';
import pb from '../utils/pocketBase';
import { Request, Response } from 'express';

/**
 * Handles login requests.
 * @param req - The request object, containing the user's email and password.
 * @param res - The response object for sending back the result.
 */
async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'E-pasts vai parole nav ievadīta' });
      return;
    }

    // Authenticate the user
    const authData = await pb
      .collection('users')
      .authWithPassword(email, password);

    // Retrieve the user's role
    const userRole = authData.record.role || 'user'; // Default to 'user' if role is not set

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET nav definēts');
    }

    // Generate a JWT token with the user's ID and role
    const token = jwt.sign(
      { userId: authData.record.id, role: userRole },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Save the token in a cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000,
    });

    // Return a successful response
    res.status(200).json({
      message: 'Esat veiksmīgi pieteicies!',
      user: {
        id: authData.record.id,
        name: authData.record.name,
        email: authData.record.email,
      },
      role: userRole,
    });
  } catch (error: unknown) {
    console.error('Authentication failed:', error);
    res.status(401).json({
      message: 'Neizdevās autentificēties',
      error,
    });
  }
}

/**
 * Logs the user out by clearing the authentication token cookie.
 * This function is synchronous and does not validate the cache.
 *
 * @param _req The request object.
 * @param res The response object.
 */
function logout(_req: Request, res: Response): void {
  res.clearCookie('authToken', {
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
    path: '/',
  });
  res.status(200).json({ message: 'Esat veiksmīgi izrakstījies' });
}

export { login, logout };

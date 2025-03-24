import jwt from 'jsonwebtoken';
import pb from '../utils/pocketBase';
import { Request, Response } from 'express';

/**
 * Handles login requests.
 * @param req - The request object, containing the user's email and password.
 * @param res - The response object for sending back the result.
 */
async function login(req: Request, res: Response): Promise<void> {
  const isProduction = process.env.NODE_ENV === 'production';
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      // Return an error if either the email or password is missing
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Authenticate the user
    const authData = await pb
      .collection('users')
      .authWithPassword(email, password);

    // Retrieve the user's role
    const userRole = authData.record.role || 'user'; // Default to 'user' if role is not set

    // Generate a JWT token with the user's ID and role
    const token = jwt.sign(
      { userId: authData.record.id, role: userRole },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    // Save the token in a cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: isProduction,
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
    const errorMessage = isProduction
      ? 'Neizdevās autentificēties. Lūdzu, mēģiniet vēlreiz.'
      : (error as Error)?.message || 'Nezināma kļūda';
    
    !isProduction && console.error('Autentifikācijas kļūda:', error);

    res.status(401).json({
      error: 'Neizdevās autentificēties',
      message: errorMessage,
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
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('authToken', {
    httpOnly: true,
    sameSite: 'strict',
    secure: isProduction,
  });
  res.status(200).json({ message: 'Esat veiksmīgi izrakstījies' });
}

export { login, logout };

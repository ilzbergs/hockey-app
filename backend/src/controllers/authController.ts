import { getPB } from '../utils/pocketBase';
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

    const pb = getPB(req);
    // Authenticates the user with PocketBase using the provided email and password
    const authData = await pb
      .collection('users')
      .authWithPassword(email, password);
    if (!authData) {
      res.status(401).json({ message: 'Nepareizs lietotājvārds vai parole' });
      return;
    }

    const user = authData.record;

    // Set the authentication token as a cookie in the response header
    const cookie = pb.authStore.exportToCookie({
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    //Set the cookie in the response header
    res.setHeader('Set-Cookie', cookie);

    res.status(200).json({
      message: 'Esat veiksmīgi pieteicies!',
      user: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        predictionActive: user.predictionActive,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Autentifikācija neizdevās te:', error);
    res
      .status(401)
      .json({ message: 'Nepareizi pieteikšanās dati. Mēgini vēlreiz!' });
  }
}

/**
 * Logs the user out by clearing the authentication token cookie.
 * This function is synchronous and does not validate the cache.
 *
 * @param _req The request object.
 * @param res The response object.
 */
async function logout(req: Request, res: Response): Promise<void> {
  try {
    const pb = getPB(req);

    res.setHeader(
      'Set-Cookie',
      'pb_auth=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    );

    // Clear the auth store in PocketBase
    pb.authStore.clear();

    res.status(200).json({ message: 'Izrakstīšanās veiksmīga!' });
  } catch (error) {
    console.error('Izrakstīšanās kļūda:', error);
    res.status(500).json({ message: 'Neizdevās izrakstīties' });
  }
}


/**
 * Requests a password reset for the given email.
 */
async function requestPasswordReset(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: 'E-pasts nav ievadīts' });
      return;
    }

    const pb = getPB(req);

    // PocketBase izveido token un (lokāli) logā izdrukā reset saiti
    await pb.collection('users').requestPasswordReset(email);

    console.log(`Password reset requested for ${email}`);
    res.json({
      message:
        'Paroles atjaunošanas saite nosūtīta uz e-pastu (lokāli check logs)',
    });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(400).json({ message: 'Neizdevās nosūtīt reset saiti' });
  }
}

/**
 * Resets password using the token from PocketBase.
 */
async function resetPassword(req: Request, res: Response) {
  try {
    const { token, password, passwordConfirm } = req.body;

    if (!token || !password || !passwordConfirm) {
      res.status(400).json({ message: 'Trūkst token vai jauna parole' });
      return;
    }

    const pb = getPB(req);

    await pb
      .collection('users')
      .confirmPasswordReset(token, password, passwordConfirm);

    res.json({ message: 'Parole veiksmīgi nomainīta!' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(400).json({ message: 'Neizdevās nomainīt paroli' });
  }
}

export { login, logout, requestPasswordReset, resetPassword };

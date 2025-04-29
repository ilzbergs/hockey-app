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

    // Iegūstam sīkdatnes no PocketBase
    const cookie = pb.authStore.exportToCookie({
      httpOnly: true,
      secure: false,
      sameSite: 'none',
    });

    // Uzstādām sīkdatnes klientam
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
    res.status(401).json({ message: 'Nepareizi pieteikšanās dati vecīt' });
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

    // Notīra autentifikācijas datus PocketBase pusē
    pb.authStore.clear();

    // Ģenerē sīkdatni, kas atceļ esošo (uzliek ar expired datumu)
    const expiredCookie = pb.authStore.exportToCookie({
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    });

    // Uzstāda sīkdatni ar nulles vērtību (iztīrīt)
    res.setHeader('Set-Cookie', expiredCookie);

    res.status(200).json({ message: 'Izrakstīšnās veiksmīga!' });
  } catch (error) {
    console.error('Izrakstīšanās kļūda:', error);
    res.status(500).json({ message: 'Neizdevās izrakstīties' });
  }
}

export { login, logout };

import dotenv from 'dotenv';
import { getPB } from '../utils/pocketBase';
import { Request, Response } from 'express';

// Load environment variables
dotenv.config();

/**
 * Creates a new user in the PocketBase database with the provided data.
 * The user is initialized with predictionActive set to false.
 *
 * @param {Request} req - The request object, containing user data in the body.
 * @param {Response} res - The response object for sending back the result.
 */
async function createUser(req: Request, res: Response) {
  const { email, password, firstName, lastName, role, username } = req.body;

  try {
    const pb = getPB(req);
    // Create the new user in the 'users' collection with predictionActive set to false
    await pb.collection('users').create({
      email,
      password,
      firstName,
      lastName,
      role,
      username,
      passwordConfirm: password,
      predictionActive: false,
    });

    const authData = await pb
      .collection('users')
      .authWithPassword(email, password);

    // Saglabā PocketBase autentifikācijas sīkdatni
    const authCookie = pb.authStore.exportToCookie({
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    res.setHeader('Set-Cookie', authCookie);

    // Atgriež lietotāja datus
    res.status(201).json({
      message: 'Lietotājs veiksmīgi izveidots',
      user: {
        id: authData.record.id,
        email: authData.record.email,
        username: authData.record.username,
        firstName: authData.record.firstName,
        lastName: authData.record.lastName,
        role: authData.record.role,
        predictionActive: authData.record.predictionActive,
      },
    });
  } catch (error: any) {
    console.error('Reģistrācijas kļūda:', error);
    res
      .status(500)
      .json({ message: 'Neizdevās izveidot lietotāju. Mēģiniet vēlreiz' });
  }
}

/**
 * Retrieves the authenticated user's data and sends it in the response.
 *
 * @param {Request} req - The request object, with user data attached.
 * @param {Response} res - The response object for sending back the user data.
 */

async function getUser(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Lietotājs nav autentificēts' });
      return;
    }
    const pb = getPB(req);
    // Pārliecinies, ka mēs iegūstam pilnu lietotāju no PocketBase
    const user = await pb.collection('users').getOne(req.user.id);

    res.status(200).json(user);
  } catch (error) {
    console.error('Kļūda iegūstot lietotāja datus:', error);
    res.status(500).json({ message: 'Neizdevās iegūt lietotāja datus' });
  }
}

export { createUser, getUser };

import jwt from 'jsonwebtoken';
import pb from '../utils/pocketBase';
import dotenv from 'dotenv';
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
    const userRole = authData.record.role || 'user';

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the .env file');
    }
    // Generate a JWT token with the user ID and role
    const token = jwt.sign(
      { userId: authData.record.id, role: userRole },
      jwtSecret,
      { expiresIn: '1h' }
    );
    // Save the JWT token in a cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000,
    });

    // Send a response with the created user data and a 201 status code
    res.status(201).json({
      user: authData.record,
      role: userRole,
      message: 'Lietotājs veiksmīgi izveidots',
    });
  } catch (error: any) {
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
  if (!req.user) {
    res
      .status(401)
      .json({ message: 'Neizdevās iegūt lietotāja datus. Mēģiniet vēlreiz' });
  }
  res.status(200).json(req.user);
}

export { createUser, getUser };

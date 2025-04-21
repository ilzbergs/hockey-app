import { getPB } from '../utils/pocketBase';
import { Request, Response, NextFunction } from 'express';

export async function checkAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const pb = getPB(req);

  // Pārbaudi, vai lietotājs ir autentificēts
  if (pb.authStore.isValid) {
    const user = pb.authStore.model;

    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        predictionActive: user.predictionActive,
      };

      return next(); // Tikai ja viss OK
    }
  }

  // Ja nav derīgs vai nav user objekta
  res.status(401).json({ message: 'Lietotājs nav autentificēts' });
}

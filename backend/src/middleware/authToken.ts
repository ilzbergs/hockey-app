import dotenv from 'dotenv';
import { validateToken, fetchUser } from '../utils/authUtils';

dotenv.config();

async function authenticate(
  req: any,
  res: any,
  next: any
): Promise<void> {
  try {
    // Pārbauda token un atgriež decoded datus
    const decoded = validateToken(req);

    // Iegūstam lietotāju, izmantojot decoded userId
    const user = await fetchUser(decoded.userId);

    // Piešķiram lietotāju pie req objekta
    req.user = user;

    // Turpinām uz nākamo middleware vai maršrutu
    next();
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
}

export default authenticate;


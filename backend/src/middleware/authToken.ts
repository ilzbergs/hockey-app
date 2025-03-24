// import dotenv from 'dotenv';
// import { validateToken, fetchUser } from '../utils/authUtils';

// dotenv.config();

// interface DecodedToken {
//   userId: string; 
//   role: string; 
// }


// async function authenticate(req:any, res:any, next:any) {
//   try {
//     const decoded: DecodedToken = validateToken(req);
//     const user = await fetchUser(decoded.userId);
//     req.user = user;
//     next();
//   } catch (error) {
//     res.status(401).json({ error: error.message });
//   }
// }

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


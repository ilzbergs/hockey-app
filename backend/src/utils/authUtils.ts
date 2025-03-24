import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pb from './pocketBase';

dotenv.config();

function validateToken(req:any) {
  const token= req.cookies.authToken;

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in the .env file');
  }

  if (!token) {
    throw new Error('Authorization token is missing');
  }
  try {
    const decoded = jwt.verify(token, jwtSecret)
    if (typeof decoded === 'string') {
      throw new Error('Invalid token payload');
    }
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}


async function fetchUser(userId:any) {
  const user = await pb.collection('users').getOne(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}

export { validateToken, fetchUser };

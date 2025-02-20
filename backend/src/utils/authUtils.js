import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pb from './pocketBase.js';

dotenv.config();

function validateToken(req) {
    const token = req.cookies.authToken;
    if (!token) {
        throw new Error('Authorization token is missing');
    }
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

async function fetchUser(userId) {
    const user = await pb.collection('users').getOne(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
}

export { validateToken, fetchUser };

import dotenv from 'dotenv';
import { validateToken, fetchUser } from '../utils/authUtils.js';

dotenv.config();

async function authenticate(req, res, next) {
    try {
        const decoded = validateToken(req);
        const user = await fetchUser(decoded.userId);
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}

export default authenticate;

import jwt from 'jsonwebtoken';
import pb from '../utils/pocketBase.js';

async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Authenticate the user
        const authData = await pb.collection('users').authWithPassword(email, password);
        // Retrieve the user's role
        const userRole = authData.record.role || 'user'; // Default to 'user' if role is not set

        const token = jwt.sign(
            {
                userId: authData.record.id,
                role: userRole,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Save the token in a cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000,
        });

        res.status(200).json({
            user: authData.record,
            role: userRole,
        });
    } catch (error) {
        console.error('Error authenticating user:', error.message);
        res.status(401).json({ error: 'Failed to authenticate user', details: error.message });
    }
}



async function logout(req, res) {
    try {
        res.clearCookie('authToken', {
            httpOnly: true,
            sameSite: 'Strict',
            secure: process.env.NODE_ENV === 'production',
        });
        pb.authStore.clear();
        res.status(200).json({ message: 'Successfully logged out' });
    } catch (error) {
        console.error('Error logging out user:', error.message);
        res.status(500).json({ error: 'Failed to log out user', details: error.message });
    }
}

export { login, logout };

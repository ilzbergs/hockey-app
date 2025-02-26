import jwt from 'jsonwebtoken';
import pb from '../utils/pocketBase.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Ensure the JWT_SECRET is defined
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the .env file");
}


/**
 * Creates a new user in the PocketBase database with the provided data.
 * The user is initialized with predictionActive set to false.
 *
 * @param {import('express').Request} req - The request object, containing user data in the body.
 * @param {import('express').Response} res - The response object for sending back the result.
 */
async function createUser(req, res) {

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
            predictionActive: false
        });

        const authData = await pb.collection('users').authWithPassword(email, password);
        const userRole = authData.record.role || 'user';
        // Ģenerē JWT tokenu
        const token = jwt.sign(
            { userId: authData.record.id, role: userRole },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        // Saglabā tokenu kā sīkdatni
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000,
        });

        // Send a response with the created user data and a 201 status code
        res.status(201).json({
            user: authData.record,
            role: userRole
        });
    } catch (error) {
        // Log error and send a 500 status response if user creation fails
        console.error('Error creating user:', error.message);
        res.status(500).json({ error: 'Failed to create user', details: error.message });
    }
}


/**
 * Retrieves the authenticated user's data and sends it in the response.
 *
 * @param {import('express').Request} req - The request object, with user data attached.
 * @param {import('express').Response} res - The response object for sending back the user data.
 */
async function getUser(req, res) {
    try {
        // Send the user data with a 200 status code
        res.status(200).json(req.user);
    } catch (error) {
        // Handle specific error cases based on the error message
        if (error.message.includes('token')) {
            // Token-related error, respond with 401 Unauthorized
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        if (error.message.includes('found')) {
            // User not found error, respond with 404 Not Found
            return res.status(404).json({ error: 'User not found' });
        }
        // Log and respond with a 500 Internal Server Error for other errors
        console.error('Error retrieving user:', error.message);
        res.status(500).json({ error: 'Failed to process the request' });
    }
}















export { createUser, getUser, };

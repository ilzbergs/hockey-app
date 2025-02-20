import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './src/routes/userRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import gameRoutes from './src/routes/gameRoutes.js';
import predictionRoutes from './src/routes/predictionsRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();
const port = process.env.PORT || 3000;

// CORS options to allow requests from the frontend
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, 
};

// Middleware setup
app.use(cookieParser()); // Parse cookies for the auth token
app.use(cors(corsOptions)); // Enable CORS with the specified options
app.use(bodyParser.json()); // Parse incoming request bodies as JSON

// Routes setup
app.use('/auth', authRoutes); // Auth-related routes (login, logout)
app.use('/user', userRoutes); // User-related routes, with auth middleware
app.use('/games', gameRoutes);
app.use('/predictions', predictionRoutes);

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

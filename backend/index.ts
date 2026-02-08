import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './src/routes/userRoutes';
import authRoutes from './src/routes/authRoutes';
import gameRoutes from './src/routes/gameRoutes';
import predictionRoutes from './src/routes/predictionsRoutes';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

// CORS options to allow requests from the frontend
const corsOptions = {
  origin: [
    'https://hokeja-prognozes.lv',
    'https://www.hokeja-prognozes.lv',
    'http://localhost:5173',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

// Middleware setup
app.use(cookieParser()); // Parse cookies for the auth token
app.use(cors(corsOptions)); // Enable CORS with the specified options
app.options('*', cors(corsOptions)); // atbild uz preflight pieprasījumiem
app.use(bodyParser.json()); // Parse incoming request bodies as JSON

// Routes setup
app.use('/auth', authRoutes); // Auth-related routes (login, logout)
app.use('/user', userRoutes); // User-related routes, with auth middleware
app.use('/games', gameRoutes);
app.use('/predictions', predictionRoutes);

// Start the server and listen on the specified port
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${port}`);
});

import './src/utils/instrument';

import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './src/routes/userRoutes';
import authRoutes from './src/routes/authRoutes';
import gameRoutes from './src/routes/gameRoutes';
import predictionRoutes from './src/routes/predictionsRoutes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as Sentry from '@sentry/node';

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

// Kļūdu apstrādātājs (tā vietā, lai izmantotu `Handlers.errorHandler`)
// Testa maršruts kļūdu ģenerēšanai
app.get('/sentry-test', (req, res) => {
  try {
    throw new Error('Sentry test error!');
  } catch (err) {
    Sentry.captureException(err); // Sagūstām kļūdu un nosūtām uz Sentry
    res.status(200).send('Test error sent to Sentry');
  }
});

app.use(Sentry.Handlers.requestHandler());

// Testa maršruts kļūdu ģenerēšanai
app.get('/sentry-test', (req, res) => {
  try {
    throw new Error('Sentry test error!');
  } catch (err) {
    Sentry.captureException(err); // Nosūta kļūdu uz Sentry
    res.status(200).send('Test error sent to Sentry');
  }
});

// Sentry error handler
app.use(Sentry.Handlers.errorHandler());
// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

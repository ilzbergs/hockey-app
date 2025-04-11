import { validateToken } from '../utils/authUtils';
import pb from '../utils/pocketBase';
import { Request, Response } from 'express';

/**
 * Saves the predictions of the current user to the PocketBase database.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
async function savePredictions(req: Request, res: Response): Promise<void> {
  const userID = validateToken(req);
  try {
    if (!userID.userId) {
      res.status(401).json({ message: 'Unauthorized: User not found' });
      return;
    }

    const userId = userID.userId;
    const predictions = req.body;
    // Check if all predictions have homePrediction and awayPrediction values
    const invalidPrediction = predictions.some(
      (prediction: any) =>
        prediction.homePrediction == null || prediction.awayPrediction == null
    );
    if (invalidPrediction) {
      res.status(400).json({
        message: 'Jābūt aizpildītām visām prognozē',
      });
    }

    // Create prediction data objects with the user ID and initial points value
    const predictionData = predictions.map((prediction: any) => ({
      homePrediction: prediction.homePrediction,
      awayPrediction: prediction.awayPrediction,
      game: prediction.id,
      user: userId,
      points: 0,
      gameRef: prediction.gameRef,
    }));
    // Save the predictions to the PocketBase database
    const savedPredictions = await Promise.all(
      predictionData.map((data: any) =>
        pb.collection('predictions').create(data)
      )
    );

    // Update the user document to set predictionActive to true
    await pb.collection('users').update(userId, { predictionActive: true });

    res
      .status(200)
      .json({ message: 'Prognozes veiksmīgi saglabātas', savedPredictions });
  } catch (error: unknown) {
    res
      .status(500)
      .json({ message: 'Radās kļūda saglabājot prognozes. Mēģiniet vēlreiz' });
  }
}

/**
 * Retrieves the predictions of the current user from the PocketBase database.
 * The predictions are enriched with the associated user and game details.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
async function getPredictions(req: Request, res: Response): Promise<void> {
  const userID = validateToken(req);
  try {
    // Get the predictions of the current user
    const predictions = await pb.collection('predictions').getFullList({
      filter: `user.id="${userID.userId}"`,
    });
    console.log('PREDICTIONS', predictions);

    // Get the associated user and game details
    const [users, games] = await Promise.all([
      pb.collection('users').getFullList({ fields: 'id,username' }),
      pb.collection('games').getFullList({
        fields: 'id,homeTeam,awayTeam,dateTime,homeScore,awayScore,gameRef',
      }),
    ]);

    // Check if there are users and games
    if (!users || !games) {
      res.status(404).json({ message: 'Neizdevās iegūt datus' });
    }

    // Create a map of the users and games to their details
    const userMap = users.reduce((acc: any, user) => {
      acc[user.id] = user;
      return acc;
    }, {});

    const gameMap = games.reduce((acc: any, game) => {
      acc[game.id] = game;
      return acc;
    }, {});

    // Enrich the predictions with the associated user and game details
    const predictionsWithDetails = predictions.map((prediction) => {
      const userDetail = userMap[prediction.user[0]];
      const gameDetail = gameMap[prediction.game[0]];
      return {
        ...prediction,
        user: userDetail,
        game: gameDetail,
      };
    });

    // Return the enriched predictions
    res.status(200).json(predictionsWithDetails);
  } catch (error: unknown) {
    res.status(500).json({
      message: 'Radās problēma ar datu iegūšanu. Lūdzu, mēģiniet vēlreiz.',
    });
  }
}

/**
 * Retrieves all user predictions from the PocketBase database.
 *
 * @param {Request} _req - The request object.
 * @param {Response} res - The response object.
 */
async function getAllUserPredictions(_req: Request, res: Response) {
  try {
    // Retrieve all predictions, users, and games from the database
    const [predictions, users, games] = await Promise.all([
      pb.collection('predictions').getFullList(),
      pb.collection('users').getFullList({ fields: 'id,username' }),
      pb.collection('games').getFullList({
        fields: 'id,homeTeam,awayTeam,dateTime,homeScore,awayScore,gameRef',
      }),
    ]);

    // Create maps of the users and games to their details
    const userMap = Object.fromEntries(users.map((user) => [user.id, user]));
    const gameMap = Object.fromEntries(games.map((game) => [game.id, game]));

    // Enrich the predictions with the associated user and game details
    const predictionsWithDetails = predictions.map((prediction) => ({
      ...prediction,
      user: userMap[prediction.user],
      game: gameMap[prediction.game],
    }));

    // Return the enriched predictions
    res.status(200).json(predictionsWithDetails);
  } catch (error: unknown) {
    res.status(500).json({ message: 'Kļūda iegūstot prognozes' });
  }
}

export { savePredictions, getPredictions, getAllUserPredictions };

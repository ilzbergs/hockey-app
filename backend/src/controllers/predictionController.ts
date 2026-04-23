import { getPB } from '../utils/pocketBase';
import { Request, Response } from 'express';

/**
 * Saves the predictions of the current user to the PocketBase database.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */

async function savePredictions(req: Request, res: Response): Promise<void> {
  try {
    // Pārbauda, vai ir lietotāja ID
    const userID = req.user?.id;
    if (!userID) {
      res.status(401).json({ message: 'Unauthorized: User not found' });
      return;
    }

    const predictions = req.body;

    // Pārbauda, vai prognozēs ir ievadīti visi nepieciešamie dati
    const invalidPrediction = predictions.some(
      (prediction: any) =>
        prediction.homePrediction == null || prediction.awayPrediction == null,
    );
    if (invalidPrediction) {
      res.status(400).json({
        message: 'Jābūt aizpildītām visām prognozēm',
      });
      return;
    }

    // Izveido prognožu datu objektus ar lietotāja ID un sākotnējo punktu vērtību
    const predictionData = predictions.map((prediction: any) => ({
      homePrediction: prediction.homePrediction,
      awayPrediction: prediction.awayPrediction,
      game: prediction.id,
      user: userID,
      points: 0,
      gameRef: prediction.gameRef,
    }));

    const pb = getPB(req);

    // Saglabā prognozes PocketBase datubāzē, pievienojot aizkavēšanos
    const savedPredictions = [];
    for (const data of predictionData) {
      const saved = await pb.collection('predictions').create(data);
      savedPredictions.push(saved);
    }

    // Atjaunina lietotāja dokumentu, lai iestatītu `predictionActive` uz `true`
    await pb.collection('users').update(userID, { predictionActive: true });

    res
      .status(200)
      .json({ message: 'Prognozes veiksmīgi saglabātas', savedPredictions });
  } catch (error: unknown) {
    console.error('Error saving predictions:', error);
    res.status(500).json({
      message: 'Radās kļūda saglabājot prognozes. Mēģiniet vēlreiz. ' + error,
    });
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
  try {
    // Iegūstam lietotāja ID no JWT tokena
    const userID = req.user?.id;
    // Pieņemot, ka `req.user` ir pievienots ar JWT informāciju

    if (!userID) {
      res.status(401).json({ message: 'Nepareizs vai izdzēsts token' });
    }

    const pb = getPB(req);

    // Iegūstam lietotāja prognozes no PocketBase
    const predictions = await pb.collection('predictions').getFullList({
      filter: `user.id="${userID}"`,
    });

    // Iegūstam lietotājus un spēles
    const [users, games] = await Promise.all([
      pb.collection('users').getFullList({ fields: 'id,username' }),
      pb.collection('games').getFullList({
        fields: 'id,homeTeam,awayTeam,dateTime,homeScore,awayScore,gameRef',
      }),
    ]);

    // Ja dati netika atrasti
    if (!users || !games) {
      res.status(404).json({ message: 'Neizdevās iegūt datus' });
      return;
    }

    // Izveidojam lietotāju un spēļu kartes (maps)
    const userMap = users.reduce((acc: any, user) => {
      acc[user.id] = user;
      return acc;
    }, {});

    const gameMap = games.reduce((acc: any, game) => {
      acc[game.id] = game;
      return acc;
    }, {});

    // Enrich predictions ar lietotāja un spēles datiem
    const predictionsWithDetails = predictions.map((prediction) => {
      const userDetail = userMap[prediction.user[0]]; // Pieņemot, ka user ir masīvs ar ID
      const gameDetail = gameMap[prediction.game[0]]; // Pieņemot, ka game ir masīvs ar ID
      return {
        ...prediction,
        user: userDetail,
        game: gameDetail,
      };
    });
    // Atgriežam detalizētas prognozes
    res.status(200).json(predictionsWithDetails);
  } catch (error: unknown) {
    console.error('Kļūda iegūstot prognozes:', error);
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
async function getAllUserPredictions(req: Request, res: Response) {
  try {
    const pb = getPB(req);
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

import { getPB } from '../utils/pocketBase';
import { Request, Response } from 'express';

/**
 * Gets all games from PocketBase and returns them in JSON format.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function getGames(req: Request, res: Response): Promise<void> {
  try {
    const pb = getPB(req);
    // Get all games from PocketBase
    const games = await pb.collection('games').getFullList();

    if (!games || games.length === 0) {
      res.status(404).json({ message: 'Nav pieejamu spēļu' });
      return;
    }
    console.log(games);
    
    res.status(200).json(games);
  } catch (error: unknown) {
    res.status(500).json({
      message: 'Radās problēma ar datu iegūšanu. Lūdzu, mēģiniet vēlreiz.',
    });
  }
}

/**
 * Updates a game score in PocketBase and recalculates points for all associated predictions.
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body containing the game ID, home score, and away score.
 * @param {Object} res - The response object.
 */
async function updateGameScore(req: Request, res: Response): Promise<void> {
  try {
    const { gameId, homeScore, awayScore } = req.body;
    const pb = getPB(req);
    // 1. Update the game score in PocketBase
    const updatedGame = await pb.collection('games').update(gameId, {
      homeScore,
      awayScore,
      isUpdated: true,
    });

    // 2. Fetch all predictions associated with the game
    const predictions = await pb.collection('predictions').getFullList({
      filter: `game.id="${gameId}"`, // Filter predictions by game ID
    });

    /**
     * Calculates the points for a single prediction based on the home and away scores.
     * The points are calculated as follows:
     * - 5 points for each correct goal difference (home score - away score)
     * - 5 points if the home score is correct
     * - 5 points if the away score is correct
     * - 10 points if the correct outcome is predicted (home wins, away wins, or draw)
     * - 10 points if the correct draw is predicted
     * - 30 points if the exact score is predicted
     * The final points are the sum of the base points and any applicable bonuses.
     */
    function calculatePoints(
      homePrediction: number,
      awayPrediction: number,
      homeScore: number,
      awayScore: number,
    ): number {
      const diff = (a: number, b: number) => Math.abs(a - b);

      const c8 = 5 - diff(homePrediction, homeScore);
      const d8 = 5 - diff(awayPrediction, awayScore);
      const e8 =
        5 -
        diff(diff(homePrediction, awayPrediction), diff(homeScore, awayScore));
      const basePoints = c8 + d8 + e8;

      const isExact =
        homePrediction === homeScore && awayPrediction === awayScore;
      const isDraw =
        homePrediction === awayPrediction && homeScore === awayScore;
      const isCorrectOutcome =
        (homePrediction > awayPrediction && homeScore > awayScore) ||
        (homePrediction < awayPrediction && homeScore < awayScore);

      if (isExact) return 30;

      let bonus = 0;
      if (isCorrectOutcome) bonus += 10;
      if (isDraw) bonus += 10;

      return basePoints + bonus;
    }

    // 3. Map through the predictions and calculate points for each

    const updatedPredictions = predictions.map(async (prediction) => {
      const points = calculatePoints(
        prediction.homePrediction,
        prediction.awayPrediction,
        homeScore,
        awayScore,
      );

      // 4. Update the prediction with the calculated points
      await pb.collection('predictions').update(prediction.id, { points });

      return { ...prediction, points };
    });

    // 5. Wait for all predictions to be updated
    await Promise.all(updatedPredictions);

    res.status(200).json({
      message: 'Spēles rezultāts ir veiksmīgi atjaunināts',
      updatedGame,
    });
  } catch (error: unknown) {
    res.status(500).json({ message: 'Radās problēma ar datu atjaunošanu' });
  }
}
export { getGames, updateGameScore };

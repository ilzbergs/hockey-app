import pb from '../utils/pocketBase.js';
import dotenv from 'dotenv';

async function getGames(req, res) {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Iegūstam spēles no PocketBase
        const games = await pb.collection('games').getFullList(
        );
        res.status(200).json(games);
    } catch (error) {
        console.error('Error fetching games:', error);
        if (error.message.includes('token')) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        res.status(500).json({ error: 'Failed to fetch games', message:'Radās problēma ar datu iegūšanu. Lūdzu, mēģiniet vēlreiz.' });
    }
}

/**
 * Updates a game score in PocketBase and recalculates points for all associated predictions.
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body containing the game ID, home score, and away score.
 * @param {Object} res - The response object.
 */
async function updateGameScore(req, res) {
    try {
        const { gameId, homeScore, awayScore } = req.body;

        // 1. Update the game score in PocketBase
        const updatedGame = await pb.collection('games').update(gameId, {
            homeScore,
            awayScore,
        });

        // 2. Fetch all predictions associated with the game
        const predictions = await pb.collection('predictions').getFullList({
            filter: `game.id="${gameId}"`, // Filter predictions by game ID
        });

        // 3. Loop through each prediction and recalculate points
        const updatedPredictions = predictions.map(async (prediction) => {
            const { homePrediction, awayPrediction } = prediction;

            // Calculate points using the new method
            const c8 = 5 - Math.abs(homePrediction - homeScore);
            const d8 = 5 - Math.abs(awayPrediction - awayScore);
            const e6 = Math.abs(homePrediction - awayPrediction);
            const e7 = Math.abs(homeScore - awayScore);
            const e8 = 5 - Math.abs(e6 - e7);
            const f8 = c8 + d8 + e8;
            const g6 = homePrediction > awayPrediction && homeScore > awayScore ? 10 : 0;
            const g7 = g6 === 10 ? 10 : 0;
            const h6 = homePrediction < awayPrediction && homeScore < awayScore ? 10 : 0;
            const h7 = h6 === 10 ? 10 : 0;
            const i6 = homePrediction === homeScore && awayPrediction === awayScore ? 30 : 0;
            const i7 = i6 === 30 ? 30 : 0;
            const j6 = homePrediction === awayPrediction && homeScore === awayScore ? 10 : 0;
            const j7 = j6 === 10 ? 10 : 0;
            const f9 = f8 + g7 + h7 + j7;
            const f10 = i7 === 30 ? 30 : 0;
            const points = f10 === 30 ? 30 : f9;

            // 4. Update the prediction with the new points
            await pb.collection('predictions').update(prediction.id, { points });

            return { ...prediction, points };
        });

        // 5. Wait for all predictions to be updated
        await Promise.all(updatedPredictions);

        res.status(200).json({
            message: 'Game scores and predictions updated successfully',
            updatedGame,
        });
    } catch (error) {
        console.error('Error updating game score:', error);
        res.status(500).json({ error: 'Failed to update game score' });
    }
}
export { getGames, updateGameScore };

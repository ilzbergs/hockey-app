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
        res.status(500).json({ error: 'Failed to fetch games' });
    }
}

async function updateGameScore(req, res) {
    try {
        const { gameId, homeScore, awayScore } = req.body;
        // 1. Atjauninām spēles datus ar jauniem rezultātiem
        const updatedGame = await pb.collection('games').update(gameId, {
            homeScore,
            awayScore,
        });

        // 2. Saņemam visas prognozes attiecīgajai spēlei
        const predictions = await pb.collection('predictions').getFullList({
            filter: `game.id="${gameId}"`, // Filtrē prognozes pēc spēles ID
        });

        // 3. Atjauninām punktus katram lietotājam
        const updatedPredictions = predictions.map(async (prediction) => {
            let points = 0;

            // 4. Aprēķinām punktus atbilstoši spēles rezultātiem
            if (prediction.homePrediction === homeScore && prediction.awayPrediction === awayScore) {
                // Precīzs rezultāts
                points = 3;
            } else if (
                (homeScore > awayScore && prediction.homePrediction > prediction.awayPrediction) ||
                (homeScore < awayScore && prediction.homePrediction < prediction.awayPrediction) ||
                (homeScore === awayScore && prediction.homePrediction === prediction.awayPrediction)
            ) {
                // Pareizs iznākums (uzvarētājs vai neizšķirts)
                points = 1;
            }

            // 5. Atjauninām prognozes ar jauniem punktiem
            await pb.collection('predictions').update(prediction.id, {
                points,
            });

            return { ...prediction, points };
        });

        // 6. Pagaidām gaidām visus punktu atjauninājumus
        await Promise.all(updatedPredictions);

        res.status(200).json({ message: 'Game scores and predictions updated successfully', updatedGame });
    } catch (error) {
        console.error('Error updating game score:', error);
        res.status(500).json({ error: 'Failed to update game score' });
    }
} export { getGames, updateGameScore };
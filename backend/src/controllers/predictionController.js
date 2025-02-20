import pb from '../utils/pocketBase.js';

/**
 * Saves the predictions of the current user to the PocketBase database.
 *
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 */
async function savePredictions(req, res) {
    try {
        const userId = req.user.id;
        const predictions = req.body;
        // Check if all predictions have homePrediction and awayPrediction values
        const invalidPrediction = predictions.some(
            (prediction) => prediction.homePrediction == null || prediction.awayPrediction == null
        );
        if (invalidPrediction) {
            return res.status(400).json({ error: 'All predictions must have homePrediction and awayPrediction values' });
        }

        // Create prediction data objects with the user ID and initial points value
        const predictionData = predictions.map((prediction) => ({
            homePrediction: prediction.homePrediction,
            awayPrediction: prediction.awayPrediction,
            game: prediction.id,
            user: userId,
            points: 0,
        }));
        // Save the predictions to the PocketBase database
        const savedPredictions = await Promise.all(
            predictionData.map((data) => pb.collection('predictions').create(data))
        );

        // Update the user document to set predictionActive to true
        await pb.collection('users').update(userId, { predictionActive: true });

        res.status(200).json({ message: 'Predictions saved successfully', savedPredictions });
    } catch (error) {
        console.error('Error saving predictions:', error.message);
        res.status(500).json({ error: 'Failed to save predictions' });
    }
}

/**
 * Retrieves the predictions of the current user from the PocketBase database.
 * The predictions are enriched with the associated user and game details.
 *
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 */
async function getPredictions(req, res) {
    try {
        // Get the predictions of the current user
        const predictions = await pb.collection('predictions').getFullList({
            filter: `user.id="${req.user.id}"`,
        });

        // Get the associated user and game details
        const [users, games] = await Promise.all([
            pb.collection('users').getFullList({ fields: 'id,username' }),
            pb.collection('games').getFullList({ fields: 'id,homeTeam,awayTeam,dateTime,homeScore,awayScore' })
        ]);

        
        // Create a map of the users and games to their details
        const userMap = users.reduce((acc, user) => {
            acc[user.id] = user;
            return acc;
        }, {});

        const gameMap = games.reduce((acc, game) => {
            acc[game.id] = game;
            return acc;
        }, {});

        // Enrich the predictions with the associated user and game details
        const predictionsWithDetails = predictions.map(prediction => {
            const userDetail = userMap[prediction.user[0]];
            const gameDetail = gameMap[prediction.game[0]];
            return {
                ...prediction,
                user: userDetail,
                game: gameDetail
            };
        });

        // Return the enriched predictions
        res.status(200).json(predictionsWithDetails);

    } catch (error) {
        console.error('Error retrieving predictions:', error.message);
        res.status(500).json({ error: 'Failed to retrieve predictions' });
    }
}

/**
 * Retrieves all user predictions from the PocketBase database.
 *
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 */
async function getAllUserPredictions(req, res) {
    try {
        // Retrieve all predictions, users, and games from the database
        const [predictions, users, games] = await Promise.all([
            pb.collection('predictions').getFullList(),
            pb.collection('users').getFullList({ fields: 'id,username' }),
            pb.collection('games').getFullList({ fields: 'id,homeTeam,awayTeam,dateTime,homeScore,awayScore' }),
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

    } catch (error) {
        console.error('Error retrieving all user predictions:', error.message);
        res.status(500).json({ error: 'Failed to retrieve all user predictions' });
    }
}

export { savePredictions, getPredictions, getAllUserPredictions };

<template>

  <!-- Loading indikator -->
  <div v-if="isLoading" class="text-center text-lg text-gray-600 py-4">
    <span>Loading...</span>
  </div>
  <DataTable
    v-else-if="gameList.length > 0"
    :value="userStatsPrediction"
    dataKey="username"
    size="small"
    :sortField="'totalPoints'"
    :sortOrder="-1"
    scrollable
    tableStyle="min-width: 50rem"
    style="padding: 1rem"
  >
    <!-- Column for rank -->
    <Column field="rank" header="Vieta" alignFrozen="left" frozen class="font-semibold w-10  text-sm">
      <template #body="slotProps">
        {{ calculateRank(slotProps.data.predictions) }}
      </template>
    </Column>
    <!-- Column for username -->
    <Column field="username" header="Lietotājvārds" alignFrozen="left" frozen class="font-semibold w-24 text-sm">
      <template #body="slotProps">{{ slotProps.data.username }}</template>
    </Column>
    <!-- Dynamically generate columns for each game -->
    <Column v-for="game in gameList" :key="`${game.homeTeam} vs ${game.awayTeam}`">
      <!-- Column header -->
      <template #header>
        <div class="flex flex-col items-center text-sm w-[6rem]">
          <p class="text-xs text-gray-600 uppercase">{{ game.homeTeam }}</p>
          <p class="text-xs text-gray-400">vs</p>
          <p class="text-xs text-gray-600 uppercase">{{ game.awayTeam }}</p>
          <p class="font-bold text-md text-blue-600 mt-1 text-xs">
            {{ game.homeScore ?? '-' }} : {{ game.awayScore ?? '-' }}
          </p>
        </div>
      </template>
      <!--  Column body -->
      <template #body="slotProps">
        <template v-if="getPredictionByGame(slotProps.data.predictions, game)">
          <div class="w-[6rem] flex justify-center gap-2">
            <div :style="{ color: getPredictionColor(slotProps.data.predictions, game) }">
              {{ getPredictionByGame(slotProps.data.predictions, game)?.homePrediction ?? '-' }} :
              {{ getPredictionByGame(slotProps.data.predictions, game)?.awayPrediction ?? '-' }}
            </div>
            |
            <div>
              {{ getPredictionByGame(slotProps.data.predictions, game)?.points ?? 0 }}
            </div>
          </div>
        </template>
        <span v-else>-</span>
      </template>
    </Column>
    <!-- Column for total points -->
    <Column header="Punkti" alignFrozen="right" frozen class="font-semibold w-[4rem] text-sm">
      <template #body="slotProps">
        {{ calculateTotalPoints(slotProps.data.predictions) }}
      </template>
    </Column>
  </DataTable>
  <div v-else class="text-center text-lg text-gray-600 py-4">
    <span>Spēļu rezultāti vēl nav atjaunoti!</span>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue'
import DataTable from 'primevue/datatable'

import Column from 'primevue/column'
import { usePredictionsStore, UserPrediction } from '../stores/predictionStore'
import { useGamesStore } from '../stores/gameStore'

// Stores
const predictionStore = usePredictionsStore()
const games = useGamesStore()

const isLoading = computed(() => predictionStore.isLoading)

// These colors are used to indicate the correctness of the predictions in the table
const PREDICTION_COLOR = {
  correct: '#3b82f6',
  partial: '#10b981',
  incorrect: '#ef4444',
  unknown: '#9ca3af',
}

// Props
const props = defineProps({
  data: {
    type: Array as PropType<UserPrediction[]>,
    required: true,
  },
})

/**
 * Computes a list of user stats (username, total points, predictions) for the
 * summary table.
 *
 * @param data the list of user predictions
 * @returns an array of user stats, sorted by total points descending
 */
const userStatsPrediction = computed(() => {
  // Map of user IDs to user stats objects
  const userMap: Record<
    string,
    { username: string; totalPoints: number; predictions: UserPrediction[] }
  > = {}

  // Iterate over the predictions and add them to the user map
  for (const prediction of props.data) {
    const userId = prediction.user.id
    // Initialize the user stats object if it doesn't exist
    const userData = (userMap[userId] ??= {
      username: prediction.user.username,
      totalPoints: 0,
      predictions: [],
    })
    // Add the prediction to the user's prediction list
    userData.predictions.push(prediction)
    // Increment the user's total points by the prediction's points
    userData.totalPoints += prediction.points ?? 0
  }

  // Convert the user map to an array of user stats objects
  return Object.values(userMap).sort((a, b) => b.totalPoints - a.totalPoints)
})

/**
 * Computes the list of games for the summary table.
 *
 * @param data  the list of user predictions
 * @returns an array of games, sorted by gameRef
 */
const gameList = computed(() => {
  const gamesList: {
    homeTeam: string
    awayTeam: string
    homeScore: number | null
    awayScore: number | null
    gameRef: number
    isUpdated: boolean
  }[] = []

  // Iterējam pār spēlēm, kas nāk no useGamesStore()
  for (const game of games.games) {
    // Pārbaudām, vai spēlei ir isUpdated === true
    if (game.isUpdated) {
      gamesList.push({
        homeTeam: game.homeTeam,
        awayTeam: game.awayTeam,
        homeScore: game.homeScore,
        awayScore: game.awayScore,
        gameRef: game.gameRef,
        isUpdated: game.isUpdated,
      })
    }
  }

  // Sakārtojam spēles pēc gameRef
  return gamesList.sort((a, b) => a.gameRef - b.gameRef)
})

/**
 * Finds a prediction for a specific game from a list of predictions.
 *
 * @param {`UserPrediction[]`} predictions - Array of predictions.
 * @param {object} game - The game to find a prediction for.
 * @param {string} game.homeTeam - Home team name.
 * @param {string} game.awayTeam - Away team name.
 * @returns {UserPrediction | undefined} - The matching prediction or undefined if not found.
 */
function getPredictionByGame(
  predictions: UserPrediction[],
  game: { homeTeam: string; awayTeam: string },
): UserPrediction | undefined {
  return predictions.find(
    (prediction) =>
      prediction.game.homeTeam === game.homeTeam && prediction.game.awayTeam === game.awayTeam,
  )
}

/**
 * Calculates the total points from an array of predictions.
 *
 * @param {UserPrediction[]} predictions - Array of user predictions.
 * @returns {number} - Total points earned.
 */
function calculateTotalPoints(predictions: UserPrediction[]): number {
  return predictions.reduce((sum, prediction) => sum + (prediction.points ?? 0), 0)
}

// Piemērs, kā izmantot šo funkciju un atjaunināt totalPoints

/**
 * Computes the color for a prediction based on whether it was correct, partially correct
 * or incorrect.
 *
 * @param {UserPrediction[]} predictions - Array of user predictions.
 * @param {object} game - The game to find a prediction for.
 * @param {string} game.homeTeam - Home team name.
 * @param {string} game.awayTeam - Away team name.
 * @param {number | null} game.homeScore - Home team score.
 * @param {number | null} game.awayScore - Away team score.
 * @returns {string} - A color indicating the correctness of the prediction.
 */
function getPredictionColor(
  predictions: UserPrediction[],
  game: {
    homeTeam: string
    awayTeam: string
    homeScore: number | null
    awayScore: number | null
  },
): string {
  const prediction = predictions.find(
    (p) => p.game.homeTeam === game.homeTeam && p.game.awayTeam === game.awayTeam,
  )

  if (!prediction || game.homeScore === null || game.awayScore === null) {
    return PREDICTION_COLOR.unknown
  }

  // Check if the prediction is 100% correct
  const correct =
    prediction.homePrediction === game.homeScore && prediction.awayPrediction === game.awayScore

  // Check if the prediction is partially correct
  const predictedOutcome =
    (prediction.homePrediction ?? 0) > (prediction.awayPrediction ?? 0)
      ? 'homeWin'
      : (prediction.homePrediction ?? 0) < (prediction.awayPrediction ?? 0)
        ? 'awayWin'
        : 'draw'

  const actualOutcome =
    game.homeScore > game.awayScore
      ? 'homeWin'
      : game.homeScore < game.awayScore
        ? 'awayWin'
        : 'draw'

  const partialCorrect =
    prediction.homePrediction === game.homeScore ||
    prediction.awayPrediction === game.awayScore ||
    predictedOutcome === actualOutcome

  return correct
    ? PREDICTION_COLOR.correct
    : partialCorrect
      ? PREDICTION_COLOR.partial
      : PREDICTION_COLOR.incorrect
}

/**
 * Computes the rank of a user based on their total points.
 *
 * @param {UserPrediction[]} userPredictions - Array of user predictions.
 * @returns {number} - The user's rank based on their points.
 */
function calculateRank(userPredictions: UserPrediction[]): number {
  // Get the total points for the user
  const totalPoints = calculateTotalPoints(userPredictions)

  // Find the rank by comparing the total points with the other users' points
  return (
    userStatsPrediction.value.findIndex(
      (user) => calculateTotalPoints(user.predictions) === totalPoints,
    ) + 1
  ) // +1 because array index starts at 0
}
</script>

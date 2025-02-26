<template>
  <PageHeader title="Turnīra tabula">
    <template #legend>
      <div class="mx-auto p-6">
        <div class="flex items-center space-x-6 text-sm mb-4">
          <div class="flex items-center space-x-2">
            <span class="w-4 h-4 bg-blue-500 rounded"></span>
            <span>Pareizs rezultāts</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="w-4 h-4 bg-green-500 rounded"></span>
            <span>Daļēji pareizs rezultāts</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="w-4 h-4 bg-red-500 rounded"></span>
            <span> Nepareizs rezultāts</span>
          </div>
        </div>
        <div class="p-4 mb-4">
          <p class="text-2xl font-semibold">
            <span class="text-blue-500">1 : 3</span> | <span>30</span>
          </p>

          <p class="text-sm text-gray-600 mt-2">
            <span class="font-semibold text-blue-500">Jūsu prognoze</span> |
            <span class="font-semibold">Jūsu nopelnītie punkti par spēli</span>
          </p>
        </div>
      </div>
    </template>
  </PageHeader>
  <!-- Loading indikator -->
  <div v-if="isLoading" class="text-center text-lg text-gray-600 py-4">
    <span>Loading...</span>
  </div>
  <DataTable
    v-else
    :value="userStatsPrediction"
    dataKey="username"
    size="small"
    :sortField="'totalPoints'"
    :sortOrder="-1"
    scrollable
    tableStyle="min-width: 50rem"
    style="padding: 1rem"
  >
    <!-- Column for username -->
    <Column field="username" header="Lietotājvārds" frozen class="font-semibold w-20 text-sm">
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
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue'
import DataTable from 'primevue/datatable'
import PageHeader from './PageHeader.vue'
import Column from 'primevue/column'
import { usePredictionsStore, UserPrediction } from '../stores/predictionStore'
import { useUserStore } from '../stores/userStore'

// Stores
const predictionStore = usePredictionsStore()
const userStore = useUserStore()

const isLoading = computed(() => predictionStore.isLoading || userStore.isLoading)

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
  const games: {
    homeTeam: string
    awayTeam: string
    homeScore: number | null
    awayScore: number | null
    gameRef: number
  }[] = []

  for (const prediction of props.data) {
    const game = prediction.game

    // Find an existing game in the list with the same home and away teams
    const existingGame = games.find(
      (g) => g.homeTeam === game.homeTeam && g.awayTeam === game.awayTeam,
    )

    if (existingGame) {
      existingGame.homeScore ??= game.homeScore
      existingGame.awayScore ??= game.awayScore
    } else {
      games.push({ ...game })
    }
  }

  // Sort the games by gameRef
  return games.sort((a, b) => a.gameRef - b.gameRef)
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

/**
 * Determines the color based on the prediction accuracy for a game.
 *
 * @param {UserPrediction[]} predictions - Array of user predictions.
 * @param {object} game - The game for which the color is determined.
 * @param {string} game.homeTeam - Home team name.
 * @param {string} game.awayTeam - Away team name.
 * @param {number | null} game.homeScore - Home team score (nullable if game not played).
 * @param {number | null} game.awayScore - Away team score (nullable if game not played).
 * @returns {string} - Hex color code representing the prediction accuracy.
 */
function getPredictionColor(
  predictions: UserPrediction[],
  game: { homeTeam: string; awayTeam: string; homeScore: number | null; awayScore: number | null },
): string {
  const prediction = getPredictionByGame(predictions, game)
  if (!prediction || game.homeScore === null || game.awayScore === null) {
    return '#9ca3af'
  }

  const homeCorrect = prediction.homePrediction === game.homeScore
  const awayCorrect = prediction.awayPrediction === game.awayScore

  if (homeCorrect && awayCorrect) {
    return '#3b82f6'
  } else if (homeCorrect || awayCorrect) {
    return '#10b981'
  } else {
    return '#ef4444'
  }
}
</script>

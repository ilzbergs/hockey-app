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
    :value="groupedData"
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
    <Column v-for="game in games" :key="`${game.homeTeam} vs ${game.awayTeam}`">
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
        <template v-if="getPrediction(slotProps.data.predictions, game)">
          <div class="w-[6rem] flex justify-center gap-2">
            <div :style="{ color: getPredictionColor(slotProps.data.predictions, game) }">
              {{ getPrediction(slotProps.data.predictions, game)?.homePrediction ?? '-' }} :
              {{ getPrediction(slotProps.data.predictions, game)?.awayPrediction ?? '-' }}
            </div>
            |
            <div>
              {{ getPrediction(slotProps.data.predictions, game)?.points ?? 0 }}
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

const predictionStore = usePredictionsStore()
const userStore = useUserStore()

const isLoading = computed(() => predictionStore.isLoading || userStore.isLoading)

const props = defineProps({
  data: {
    type: Array as PropType<UserPrediction[]>,
    required: true,
  },
})

const groupedData = computed(() => {
  const userMap = new Map<
    string,
    { username: string; totalPoints: number; predictions: UserPrediction[] }
  >()

  props.data.forEach((prediction) => {
    const userId = prediction.user.id
    if (!userMap.has(userId)) {
      userMap.set(userId, {
        username: prediction.user.username,
        totalPoints: 0,
        predictions: [],
      })
    }

    const userData = userMap.get(userId)!
    userData.predictions.push(prediction)
    userData.totalPoints += prediction.points ?? 0
  })

  return Array.from(userMap.values())
})

const games = computed(() => {
  const gamesMap = new Map<
    string,
    { homeTeam: string; awayTeam: string; homeScore: number | null; awayScore: number | null }
  >()

  props.data.forEach((prediction) => {
    const gameKey = `${prediction.game.homeTeam} vs ${prediction.game.awayTeam}`

    if (!gamesMap.has(gameKey)) {
      gamesMap.set(gameKey, {
        homeTeam: prediction.game.homeTeam,
        awayTeam: prediction.game.awayTeam,
        homeScore: prediction.game.homeScore ?? null,
        awayScore: prediction.game.awayScore ?? null,
      })
    }
  })

  return Array.from(gamesMap.values())
})

const getPrediction = (
  predictions: UserPrediction[],
  game: { homeTeam: string; awayTeam: string },
) => {
  return predictions.find(
    (p) => p.game.homeTeam === game.homeTeam && p.game.awayTeam === game.awayTeam,
  )
}

// Function to calculate total points for each user
const calculateTotalPoints = (predictions: UserPrediction[]) => {
  return predictions.reduce((sum, prediction) => sum + (prediction.points ?? 0), 0)
}
const getPredictionColor = (
  predictions: UserPrediction[],
  game: { homeTeam: string; awayTeam: string; homeScore: number | null; awayScore: number | null },
) => {
  const prediction = getPrediction(predictions, game)
  if (!prediction || game.homeScore === null || game.awayScore === null) {
    return '#9ca3af' // Pelēks, ja nav rezultāta
  }

  const homeCorrect = prediction.homePrediction === game.homeScore
  const awayCorrect = prediction.awayPrediction === game.awayScore

  if (homeCorrect && awayCorrect) {
    return '#3b82f6' // Zils
  } else if (homeCorrect || awayCorrect) {
    return '#10b981' // Zaļš
  } else {
    return '#ef4444' // Sarkans
  }
}
</script>

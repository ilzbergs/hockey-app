<template>
  <div class="flex justify-between">
    <!-- Zaļais bloks -->
    <div class="flex w-full flex-1 relative p-4">
      <div v-for="item in stats" :key="item.label" class="relative mx-2">
        <span class="text-gray-200 text-sm">{{ item.label }}: </span>
        <span :class="item.color + ' font-semibold'">{{ item.value }}</span>
      </div>
    </div>

    <!-- Sarkanais bloks -->
    <div class="flex items-center justify-center p-4 text-sm">
      Atlikušas {{ remainingGames }} spēles
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useGamesStore } from '../stores/gameStore'
import { usePredictionsStore, UserPrediction } from '../stores/predictionStore'

// Stores
const predictionStore = usePredictionsStore()
const gamesStore = useGamesStore()

const data = ref<UserPrediction[]>([])

onMounted(async () => {
  data.value = await predictionStore.listAllUsersPredictions()
  await predictionStore.fetchUserPredictions()
  await gamesStore.fetchGames()
})

// Stats calculations
const completedPredictions = computed(() =>
  predictionStore.predictions.filter((p) => {
    const relatedGame = gamesStore.games.find((g) => g.id === p.game.id)
    return p.game.homeScore !== null && p.game.awayScore !== null && relatedGame?.isUpdated
  }),
)

const totalPoints = computed(() =>
  completedPredictions.value.reduce((sum, p) => sum + (p.points ?? 0), 0),
)
const exactHits = computed(
  () =>
    completedPredictions.value.filter(
      (p) => p.homePrediction === p.game.homeScore && p.awayPrediction === p.game.awayScore,
    ).length,
)
const outcomeHits = computed(
  () =>
    completedPredictions.value.filter((p) => {
      const predictedDiff = (p.homePrediction ?? 0) - (p.awayPrediction ?? 0)
      const actualDiff = (p.game.homeScore ?? 0) - (p.game.awayScore ?? 0)
      return (
        (predictedDiff > 0 && actualDiff > 0) ||
        (predictedDiff < 0 && actualDiff < 0) ||
        (predictedDiff === 0 && actualDiff === 0)
      )
    }).length,
)
const exactPercentage = computed(() =>
  completedPredictions.value.length
    ? ((exactHits.value / completedPredictions.value.length) * 100).toFixed(1)
    : '0.0',
)
const outcomePercentage = computed(() =>
  completedPredictions.value.length
    ? ((outcomeHits.value / completedPredictions.value.length) * 100).toFixed(1)
    : '0.0',
)

// Stats items
const stats = ref([
  {
    label: 'Kopējie punkti',
    value: totalPoints.value,
    color: 'text-white',
    tooltip: 'Kopējais nopelnīto punktu skaits',
    show: false,
  },
  {
    label: 'Pareizi prognozēts rezultāts',
    value: `${exactHits.value} (${exactPercentage.value}%)`,
    color: 'text-blue-300',
    tooltip: 'Pilnīgi precīzas prognozes',
    show: false,
  },
  {
    label: 'Pareizi prognozēts uzvarētājs',
    value: `${outcomeHits.value} (${outcomePercentage.value}%)`,
    color: 'text-green-300',
    tooltip: 'Pareizs uzvarētājs, bet neprecīzs rezultāts',
    show: false,
  },
])

watch([totalPoints, exactHits, outcomeHits], () => {
  stats.value[0].value = totalPoints.value
  stats.value[1].value = `${exactHits.value} (${exactPercentage.value}%)`
  stats.value[2].value = `${outcomeHits.value} (${outcomePercentage.value}%)`
})

const remainingGames = computed(() => {
  return gamesStore.games.length - gamesStore.games.filter((game) => game.isUpdated).length
})
</script>

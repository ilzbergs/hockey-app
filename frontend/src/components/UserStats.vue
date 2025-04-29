<template>
  <div class="bg-white rounded-xl p-4 w-full max-w-md relative">
    <!-- Nospēlētas 4. no 56 spēlēm novietots labajā augšējā stūrī -->
    <p class="absolute top-0 right-2 text-sm text-gray-300">
      Nospēlētas {{ gamesPassed }}. no {{ games.length }} spēlēm
    </p>

    <div class="grid grid-cols-1 gap-2">
      <StatRow label="Kopējie punkti" :value="totalPoints" />
      <StatRow
        label="Precīzi uzminēti rezultāti"
        :value="exactHits + '&nbsp;' + '(' + `${exactPercentage}%` + ')'"
      />
      <StatRow
        label="Pareizi prognozēts uzvarētājs"
        :value="outcomeHits + '&nbsp;' + '(' + `${outcomePercentage}%` + ')'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StatRow from '../components/StatsRow.vue'
import { UserPrediction } from '../stores/predictionStore'
import { Game } from '../stores/gameStore'

const props = defineProps({
  predictions: {
    type: Array as () => UserPrediction[],
    required: true,
  },
  games: {
    type: Array as () => Game[],
    required: true,
  },
})

const completedPredictions = computed(() =>
  props.predictions.filter((p) => p.game.homeScore !== null && p.game.awayScore !== null),
)

let totalPoints = computed(() =>
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
  completedPredictions.value.length > 0
    ? ((exactHits.value / completedPredictions.value.length) * 100).toFixed(1)
    : '0.0',
)

const outcomePercentage = computed(() =>
  completedPredictions.value.length > 0
    ? ((outcomeHits.value / completedPredictions.value.length) * 100).toFixed(1)
    : '0.0',
)

const gamesPassed = computed(() => {
  return props.games.filter((game) => game.isUpdated).length
})
</script>

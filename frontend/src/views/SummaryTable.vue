<template>
  <BlurCard>
    <template v-if="data.length > 0">
      <UserStats :predictions="predictionStore.predictions" :games="gamesStore.games" />
    </template>
    <template v-else>
      Vēl neviena spēle nav notikusi!
    </template>
  </BlurCard>

  <BlurCard v-if="data.length > 0" class="mt-6">
    <SummaryTable :data="data" />
  </BlurCard>
</template>

<script setup lang="ts">
import SummaryTable from '../components/SummaryTable.vue'
import { useGamesStore } from '../stores/gameStore'
import { usePredictionsStore, UserPrediction } from '../stores/predictionStore'
import UserStats from '../components/UserStats.vue'
import { onMounted, ref } from 'vue'
import BlurCard from '../components/BlurCard.vue'

const predictionStore = usePredictionsStore()
const gamesStore = useGamesStore()

const data = ref<UserPrediction[]>([])

/**
 * Called when the component is mounted.
 * Fetches all user predictions from the server, fetches the current user's predictions
 * and fetches the list of games from the server.
 */
onMounted(async () => {
  // Fetches all user predictions from the server
  data.value = await predictionStore.listAllUsersPredictions()
  // Fetches the current user's predictions
  await predictionStore.fetchUserPredictions()
  // Fetches the list of games from the server
  await gamesStore.fetchGames()
})
</script>

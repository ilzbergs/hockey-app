<template>
  <BlurCard>
    <template v-if="showTable">
      <UserStats :predictions="predictionStore.predictions" :games="gamesStore.games" />
    </template>
    <template v-else> Vēl neviena spēle nav notikusi! </template>
  </BlurCard>

  <BlurCard v-if="showTable" class="mt-6">
    <SummaryTable :data="data" />
  </BlurCard>
</template>

<script setup lang="ts">
import SummaryTable from '../components/SummaryTable.vue'
import { useGamesStore } from '../stores/gameStore'
import { usePredictionsStore, UserPrediction } from '../stores/predictionStore'
import UserStats from '../components/UserStats.vue'
import { onMounted, ref, computed } from 'vue'
import BlurCard from '../components/BlurCard.vue'

const predictionStore = usePredictionsStore()
const gamesStore = useGamesStore()

const data = ref<UserPrediction[]>([])
const isUpdated = computed(() => gamesStore.games.some((game) => game.isUpdated))

const showTable = computed(
  () => isUpdated.value && gamesStore.games.length > 0 && data.value.length > 0,
)

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

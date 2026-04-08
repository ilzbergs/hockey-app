<template>
  <BlurCard>
    <UserStats :predictions="predictionStore.predictions" :games="gamesStore.games" />
  </BlurCard>

  <BlurCard>
    <SummaryTable :data="data" />
  </BlurCard>
</template>

<script setup lang="ts">
import SummaryTable from '../components/SummaryTable.vue'
import { useGamesStore } from '../stores/gameStore'
import { usePredictionsStore, UserPrediction } from '../stores/predictionStore'
import UserStats from '../components/UserStats.vue'
import { computed, onMounted, ref } from 'vue'
import BlurCard from '../components/BlurCard.vue'

const predictionStore = usePredictionsStore()
const gamesStore = useGamesStore()

const data = ref<UserPrediction[]>([])

onMounted(async () => {
  data.value = await predictionStore.listAllUsersPredictions()
  await predictionStore.fetchUserPredictions()
  await gamesStore.fetchGames()
})

</script>

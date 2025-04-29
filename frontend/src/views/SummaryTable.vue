<template>
  <SummaryTable :data="data" />
</template>

<script setup lang="ts">
import SummaryTable from '../components/SummaryTable.vue'
import { useGamesStore } from '../stores/gameStore'
import { usePredictionsStore, UserPrediction } from '../stores/predictionStore'
import { onMounted, ref } from 'vue'

const predictionStore = usePredictionsStore()
const games = useGamesStore()

const data = ref<UserPrediction[]>([])

onMounted(async () => {
  data.value = await predictionStore.listAllUsersPredictions()
  await games.fetchGames()
})
</script>

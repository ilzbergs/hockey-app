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
  <div class="flex flex-col justify-left mb-4 px-4 py-2 bg-white shadow-md">
    <div class="flex justify-between">
      <p class="text-xl font-semibold pb-2">Mana statistiska</p>
      <p class="flex justify-end text-sm text-gray-300">
        Nospēlētas {{ gamesPassed }} no {{ gamesStore.games.length }} spēlēm
      </p>
    </div>

    <UserStats :predictions="predictionStore.predictions" :games="gamesStore.games" />
  </div>
  <div class="flex flex-col text-xl rounded-md font-semibold mb-4 px-4 mx-2 p-2 bg-white ">
    <p>Turnīra tabula</p>
    <SummaryTable :data="data" />
  </div>
</template>

<script setup lang="ts">
import SummaryTable from '../components/SummaryTable.vue'
import { useGamesStore } from '../stores/gameStore'
import PageHeader from '../components/PageHeader.vue'
import { usePredictionsStore, UserPrediction } from '../stores/predictionStore'
import UserStats from '../components/UserStats.vue'
import { computed, onMounted, ref } from 'vue'

const predictionStore = usePredictionsStore()
const gamesStore = useGamesStore()

const data = ref<UserPrediction[]>([])

onMounted(async () => {
  data.value = await predictionStore.listAllUsersPredictions()
  await predictionStore.fetchUserPredictions()
  await gamesStore.fetchGames()
})

const gamesPassed = computed(() => {
  if (gamesStore.games.length === 0) return 0
  return gamesStore.games.filter((game) => game.isUpdated).length
})
</script>

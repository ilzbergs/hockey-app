<template>
  <BlurCard v-show="!authStore.user?.predictionActive">
    <div class="text-gray-200 text-sm mx-auto">
      <p class="font-semibold text-blue-300 mb-2">Norādījumi:</p>

      <ul class="space-y-3">
        <li>
          <span class="font-semibold text-white">Aizpildi visas prognozes</span>, lai piedalītos
          spēlē.
        </li>

        <li>
          Prognozes iespējams iesniegt tikai vienu reizi —
          <span class="text-red-400 font-semibold">pārdomā rūpīgi</span>, vēlāk mainīt nevarēs.
        </li>

        <li>
          Ievadi spēles gala rezultātu pēc <strong>60 minūtēm</strong>.
          <span class="text-gray-400 italic">Papildlaiki un bullīši netiek ņemti vērā.</span>
        </li>

        <li>Atļauts prognozēt <strong>neizšķirtu</strong>.</li>
      </ul>

      <p class="mt-4 text-green-400 font-medium text-center text-base">Veiksmi! 🍀</p>
    </div>
  </BlurCard>
  <BlurCard>
    <!-- LOADING -->
    <div v-if="isLoading" class="text-center text-gray-300 text-lg py-6">Ielādējas...</div>

    <!-- CONTENT -->
    <div v-else>
      <!-- LIST VIEW -->
      <Predictions v-if="authStore.user?.predictionActive" mode="list" v-model="predictions" />

      <!-- ADD MODE -->
      <Predictions
        v-else
        mode="add"
        :addEndDate="new Date('2026-05-15T16:20:00')"
        v-model="games"
      />
    </div>
  </BlurCard>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { usePredictionsStore, UserPrediction } from '../stores/predictionStore'
import { useGamesStore } from '../stores/gameStore'
import { useAuthStore } from '../stores/authStore'
import Predictions from '../components/Predictions.vue'
import BlurCard from '../components/BlurCard.vue'

const authStore = useAuthStore()
const predictionStore = usePredictionsStore()
const gameStore = useGamesStore()

const predictions = ref<UserPrediction[]>([])
const games = ref<any[]>([])

const isLoading = computed(() => predictionStore.isLoading || gameStore.isLoading)

watch(
  () => authStore.user?.predictionActive,
  async (active) => {
    if (active) {
      predictions.value = await predictionStore.fetchUserPredictions()
    } else {
      games.value = await gameStore.fetchGames()
    }
  },
)

onMounted(async () => {
  if (authStore.user?.predictionActive) {
    predictions.value = await predictionStore.fetchUserPredictions()
  } else {
    games.value = await gameStore.fetchGames()
  }
})
</script>

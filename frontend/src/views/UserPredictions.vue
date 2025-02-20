<template>
  <PageHeader title="Manas Prognozes">
    <template #legend>
      <p class="text-sm text-gray-600">
        <strong v-if="!userStore.user?.predictionActive">Norādījumi:</strong>
        <span v-if="userStore.user?.predictionActive">
          <strong>Jūsu prognozes ir veiksmīgi iesniegtas!</strong> Jūs vairs nevarat tās mainīt, bet
          varat skatīt, kā tās izskatās.
        </span>
      </p>
      <p v-if="!userStore.user?.predictionActive" class="text-sm text-gray-600">
        Lai pievienotu prognozes, aizpildiet visus nepieciešamos laukus katrai spēlei. Pēc
        saglabāšanas prognozes nevarēs mainīt!
      </p>
      <p v-else class="text-sm text-gray-600">
        Prognozes par katru spēli ir apstiprinātas un nevar tikt mainītas pēc saglabāšanas.
      </p>
    </template>
  </PageHeader>
  <!-- Loading indikator -->
  <div v-if="isLoading" class="text-center text-lg text-gray-600 py-4">
    <span>Loading...</span>
  </div>
  <div v-else>
    <AddPredictions v-if="!userStore.user?.predictionActive" v-model="games" />
    <SubmittedPredictions v-else v-model="predictions" />
  </div>
</template>

<script setup lang="ts">
import AddPredictions from '../components/AddPredictions.vue'
import SubmittedPredictions from '../components/SubmittedPredictions.vue'
import PageHeader from '../components/PageHeader.vue'
import { useUserStore } from '../stores/userStore'
import { computed, onMounted, ref, watch } from 'vue'
import { usePredictionsStore, UserPrediction } from '../stores/predictionStore'
import { useGamesStore } from '../stores/gameStore'

const userStore = useUserStore()
const predictionStore = usePredictionsStore()
const gameStore = useGamesStore()
const predictions = ref<UserPrediction[]>([])
const games = ref<any[]>([])

// Apvienots loading stāvoklis, kas pārbauda, vai kāds veikalā ir ielādēšanas režīmā
const isLoading = computed(() => predictionStore.isLoading || gameStore.isLoading)

watch(
  () => userStore.user?.predictionActive,
  async (newVal) => {
    if (newVal === false) {
      // Kad prognozes vēl nav iesniegtas, var parādīt AddPredictions
      games.value = await gameStore.fetchGames()
    } else {
      // Kad prognozes ir iesniegtas, parādīt SubmittedPredictions
      predictions.value = await predictionStore.fetchPredictions()
    }
  },
)

onMounted(async () => {
  games.value = await gameStore.fetchGames()
  predictions.value = await predictionStore.fetchPredictions()
})
</script>

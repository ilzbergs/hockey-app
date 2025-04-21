<template>
  <PageHeader v-if="authStore.user" title="Manas Prognozes">
    <template #legend>
      <div>
        <strong v-if="!authStore.user?.predictionActive">Norādījumi:</strong>
        <p v-if="authStore.user?.predictionActive">
          “Jūsu prognozes ir veiksmīgi iesniegtas un reģistrētas!”
        </p>
      </div>
      <p v-if="!authStore.user?.predictionActive" class="text-sm text-gray-600">
        Lai pievienotu prognozes...
      </p>
    </template>
  </PageHeader>

  <div v-if="isLoading" class="text-center text-lg text-gray-600 py-4">
    <span>Loading...</span>
  </div>
  <div v-else-if="authStore.user">
    <Predictions v-if="!authStore.user.predictionActive" v-model="games" mode="add" />
    <Predictions v-else v-model="predictions" mode="list" />
  </div>
</template>


<script setup lang="ts">
import Predictions from '../components/Predictions.vue'
import PageHeader from '../components/PageHeader.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { usePredictionsStore, UserPrediction } from '../stores/predictionStore'
import { useGamesStore } from '../stores/gameStore'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()

const predictionStore = usePredictionsStore()
const gameStore = useGamesStore()
const predictions = ref<UserPrediction[]>([])
const games = ref<any[]>([])


// Apvienots loading stāvoklis, kas pārbauda, vai kāds veikalā ir ielādēšanas režīmā
const isLoading = computed(() => predictionStore.isLoading || gameStore.isLoading)

watch(
  () => authStore.user?.predictionActive,
  async (newVal) => {
    if (newVal === false) {
      // Kad prognozes vēl nav iesniegtas, var parādīt AddPredictions
      games.value = await gameStore.fetchGames()
    } else {
      // Kad prognozes ir iesniegtas, parādīt SubmittedPredictions
      predictions.value = await predictionStore.fetchUserPredictions()
    }
  },
)

onMounted(async () => {
  if (authStore.user?.predictionActive) {
    predictions.value = await predictionStore.fetchUserPredictions();
  } else {
    games.value = await gameStore.fetchGames();
  }
});


</script>

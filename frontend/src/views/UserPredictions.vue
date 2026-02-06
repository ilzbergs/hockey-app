<template>
  <PageHeader v-if="authStore.user" title="Manas Prognozes">
    <template #legend>
      <div>
        <p class ="font-semibold text-sm"  v-if="!authStore.user?.predictionActive">Norādījumi:</p>
        <p cLass="font-semibold text-sm" v-if="authStore.user?.predictionActive">
          “Jūsu prognozes ir veiksmīgi iesniegtas un reģistrētas!”
        </p>
      </div>
      <div v-if="!authStore.user?.predictionActive" class="text-sm text-gray-600 space-y-2">
        <div class="max-w-xl pl-4 pt-2">
    <ul class="list-disc list-inside space-y-2 text-gray-700">
      <li><strong>Aizpildi visas prognozes</strong>, lai piedalītos spēlē.</li>
      <li>
        <strong>Prognozes iespējams iesniegt tikai vienu reizi</strong>,
        tāpēc <span class="text-red-600 font-semibold">pārdomā tās rūpīgi</span> – vēlāk mainīt nevarēs.
      </li>
      <li>
        Norādi gala rezultātu pēc <strong>60 minūtēm</strong> – <span class="italic">papildlaiki un bullīši netiek ņemti vērā</span>.
      </li>
      <li>Atļauts prognozēt arī <strong>neizšķirtu</strong>.</li>
    </ul>
    <p class="mt-4 text-green-600 font-medium">Veiksmi! 🍀</p>
  </div>
      </div>
    </template>
  </PageHeader>
  <div v-if="isLoading" class="text-center text-lg text-gray-600 py-4">
    <span>Loading...</span>
  </div>
  <div v-else-if="authStore.user">
    <Predictions
      v-if="!authStore.user.predictionActive"
      v-model="games"
      mode="add"
      :addEndDate="new Date('2026-01-11T17:40:00')"
    />
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

// Add loading state to show loading spinner
const isLoading = computed(() => predictionStore.isLoading || gameStore.isLoading)

// Watch for changes in the user's prediction status
// and fetch predictions or games accordingly
watch(
  () => authStore.user?.predictionActive,
  async (newVal) => {
    if (newVal === false) {
      // When predictions are not active, fetch games
      games.value = await gameStore.fetchGames()
    } else {
      // When predictions are active, fetch user predictions
      predictions.value = await predictionStore.fetchUserPredictions()
    }
  },
)

// Load predictions or games based on user prediction status
onMounted(async () => {
  if (authStore.user?.predictionActive) {
    predictions.value = await predictionStore.fetchUserPredictions()
  } else {
    games.value = await gameStore.fetchGames()
  }
})
</script>

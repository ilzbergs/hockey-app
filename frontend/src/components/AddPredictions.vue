<template>
  <div class="flex flex-wrap justify-center gap-2 mt-4">
    <div
      v-for="prediction in modelValue"
      :key="prediction.id"
      :class="[
        'flex w-[350px] justify-around p-2 border',
        prediction.awayPrediction !== undefined && prediction.homePrediction !== undefined
          ? 'bg-green-50'
          : 'bg-red-50',
      ]"
    >
      <div class="flex flex-col items-center gap-1">
        <img
          :src="fetchCountryImage(prediction.homeTeam)"
          :alt="prediction.homeTeam"
          style="width: 60px; height: 40px; object-fit: cover"
        />
        <InputNumber
          v-model="prediction.homePrediction"
          @input="updatePrediction(prediction, 'homePrediction')"
          showButtons
          buttonLayout="vertical"
          style="width: 3rem"
          :min="0"
          :max="99"
        >
          <template #incrementicon>
            <span class="pi pi-plus" />
          </template>
          <template #decrementicon>
            <span class="pi pi-minus" />
          </template>
        </InputNumber>
      </div>
      <!-- Game info -->
      <div class="flex flex-col items-center justify-around">
        <div class="text-md flex flex-col">
          {{ prediction.homeTeam }} vs {{ prediction.awayTeam }}
        </div>
        <div>{{ prediction.dateTime }}</div>
      </div>
      <div class="flex flex-col items-center gap-1">
        <img
          :src="fetchCountryImage(prediction.awayTeam)"
          :alt="prediction.awayTeam"
          style="width: 60px; height: 40px; object-fit: cover"
        />
        <InputNumber
          v-model="prediction.awayPrediction"
          @input="updatePrediction(prediction, 'awayPrediction')"
          showButtons
          buttonLayout="vertical"
          style="width: 3rem"
          :min="0"
          :max="99"
        >
          <template #incrementicon>
            <span class="pi pi-plus" />
          </template>
          <template #decrementicon>
            <span class="pi pi-minus" />
          </template>
        </InputNumber>
      </div>
    </div>
    <div class="w-full flex justify-center mt-4">
      <Button label="Saglabāt" @click="saveUserPredictions" :disabled="!predictionsFilled" />
    </div>
  </div>
</template>

<script setup lang="ts">
import 'primeicons/primeicons.css'
import { useUserStore } from '../stores/userStore'
import { watch, ref } from 'vue'
import { InputNumber, Button } from 'primevue'
import countryImages from '../data/flags'
import { usePredictionsStore, UserPrediction } from '../stores/predictionStore'

// State
const userStore = useUserStore()
const predictionStore = usePredictionsStore()
const predictionsFilled = ref(false)
const errorMessage = ref<string | null>(null)

// Props
const props = defineProps({
  modelValue: {
    type: Array as () => UserPrediction[],
    required: true,
  },
})

// Emits
const emit = defineEmits(['update:modelValue'])

/**
 * Watches the modelValue prop for changes and updates the predictionsFilled variable
 * accordingly. If all predictions in the modelValue array have both homePrediction and
 * awayPrediction defined, predictionsFilled is set to true. Otherwise, it is set to false.
 */
watch(
  () => props.modelValue,
  (newVal) => {
    // Check if all predictions in the modelValue array have both homePrediction and awayPrediction defined
    predictionsFilled.value = newVal.every(
      (game) => game.awayPrediction !== undefined && game.homePrediction !== undefined,
    )
  },
  // Watch the modelValue prop deeply, so that changes to the array's contents are detected
  { deep: true },
)

/**
 * Returns the image URL for a given country name from the countryImages array.
 *
 * If the country name is not found in the array, it returns the default image URL.
 *
 * @param {string} countryName - The country name to search for.
 * @returns {string} The image URL for the given country name.
 */
function fetchCountryImage(countryName: string): string {
  return (
    countryImages.find((country) => country.country === countryName)?.image || 'default-image.png'
  )
}

/**
 * Updates a single prediction in the model value based on the given prediction type.
 *
 * @param {UserPrediction} prediction - The prediction to update.
 * @param {'homePrediction' | 'awayPrediction'} predictionType - The type of prediction to update.
 */
function updatePrediction(
  prediction: UserPrediction,
  predictionType: 'homePrediction' | 'awayPrediction',
): void {
  // Emit an event to update the model value with the new prediction data
  emit('update:modelValue', [
    // Iterate over each game in the current model value
    ...props.modelValue.map((game) => {
      // Check if the current game matches the prediction's game by comparing their IDs
      if (game.id === prediction.id) {
        // If the IDs match, create a new game object with the updated prediction
        return {
          ...game,
          // Update the prediction based on the prediction type
          [predictionType]: prediction[predictionType],
        }
      } else {
        // If the IDs do not match, return the game unchanged
        return game
      }
    }),
  ])
}

/**
 * Attempts to save the user's predictions to the server and updates the user's state accordingly.
 *
 * If the save is successful, the user's state is updated to indicate that predictions are active.
 * If the save is unsuccessful, an error message is displayed.
 */
async function saveUserPredictions() {
  // Attempt to save the user's predictions to the server
  const success = await predictionStore.savePredictions(props.modelValue)

  // If successful, update the user's state to indicate that predictions are active
  if (success) {
    // Update the user's state to indicate that predictions are active
    if (userStore.user) {
      userStore.user.predictionActive = true
    }
    // Clear any existing error message
    errorMessage.value = null
  } else {
    // If not successful, set an error message
    errorMessage.value = 'Neizdevās saglabāt prognozes. Lūdzu, mēģiniet vēlreiz.'
  }
}
</script>

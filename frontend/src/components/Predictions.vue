<template>
  <div class="flex flex-wrap justify-center gap-2 mt-4">
    <div
      v-for="prediction in sortedPredictions"
      :key="prediction.id"
      :class="[
        'flex w-[18rem] justify-around p-2 border rounded-md',
        authStore.user?.predictionActive
          ? 'bg-sky-50 border-sky-200' // If the user has already made predictions, the card is blue
          : prediction.awayPrediction !== undefined &&
              prediction.homePrediction !== null &&
              prediction.homePrediction !== undefined &&
              prediction.awayPrediction !== null
            ? 'bg-green-50 border-green-200' // If the user has made a prediction, the card is green
            : 'bg-red-50 border-red-200', // If the user has not made a prediction, the card is red
      ]"
    >
      <!-- Home team -->
      <div class="flex flex-col items-center gap-2">
        <img
          :src="fetchCountryImage(mode === 'add' ? prediction.homeTeam : prediction.game.homeTeam)"
          :alt="mode === 'add' ? prediction.awayTeam : prediction.game.awayTeam"
          class="rounded-md w-[80px] h-[40px] object-cover"
        />
        <InputNumber
          v-if="mode === 'add'"
          v-model="prediction.homePrediction"
          @input="updatePrediction(prediction, 'homePrediction')"
          showButtons
          buttonLayout="vertical"
          class="w-12"
          :min="0"
          :max="99"
        />
        <p v-else class="text-xl font-bold">{{ prediction.homePrediction }}</p>
      </div>
      <!-- Game info -->
      <div class="flex flex-col items-center gap-2 w-full py-2 justify-between">
        <div class="text-md font-semibold text-gray-600 flex items-baseline gap-1">
          {{ homeTeam(prediction) }} <span class="text-sm text-gray-400 lowercase">vs</span>
          {{ awayTeam(prediction) }}
        </div>
        <div class="flex flex-col items-center text-sm text-gray-400">
          <p>{{ getFormattedDate(prediction, mode) }}</p>
          <p>{{ getFormattedTime(prediction, mode) }}</p>
        </div>
      </div>
      <!-- Away team -->
      <div class="flex flex-col items-center gap-2">
        <img
          :src="fetchCountryImage(mode === 'add' ? prediction.awayTeam : prediction.game.awayTeam)"
          :alt="mode === 'add' ? prediction.awayTeam : prediction.game.awayTeam"
          class="rounded-md w-[80px] h-[40px] object-cover"
        />
        <InputNumber
          v-if="mode === 'add'"
          v-model="prediction.awayPrediction"
          @input="updatePrediction(prediction, 'awayPrediction')"
          showButtons
          buttonLayout="vertical"
          class="w-12"
          :min="0"
          :max="99"
        />
        <p v-else class="text-xl font-bold">{{ prediction.awayPrediction }}</p>
      </div>
    </div>
    <!-- Save Button when mode is 'add' -->
    <div v-if="mode === 'add'" class="w-full flex justify-center mt-4">
      <Button
        label="Saglabāt"
        @click="saveUserPredictions"
        :disabled="!predictionsFilled"
        :severity="!predictionsFilled ? 'danger' : 'info'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import 'primeicons/primeicons.css'

import { watch, ref, computed } from 'vue'
import { InputNumber, Button } from 'primevue'
import countryImages from '../data/flags'
import { usePredictionsStore, UserPrediction } from '../stores/predictionStore'
import { useAuthStore } from '../stores/authStore'

// State
const authStore = useAuthStore()
const predictionStore = usePredictionsStore()
const predictionsFilled = ref(false)

// Props
const props = defineProps({
  modelValue: {
    type: Array as () => UserPrediction[],
    required: true,
  },
  mode: {
    type: String as () => 'add' | 'list',
    required: true,
    default: 'add',
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
    predictionsFilled.value = newVal.every(
      (game) =>
        game.awayPrediction !== undefined &&
        game.homePrediction !== undefined &&
        game.awayPrediction !== null &&
        game.homePrediction !== null,
    )
  },
  { deep: true },
)

// Sort predictions based on the gameRef field (the game's order)
const sortedPredictions = computed(() => {
  return [...props.modelValue].sort(
    (a, b) => (a.gameRef || a.game.gameRef) - (b.gameRef || b.game.gameRef),
  )
})

/**
 * Returns the image URL for a given country name from the countryImages array.
 *
 * If the country name is not found in the array, it returns the default image URL.
 */
function fetchCountryImage(countryName: string): string {
  return (
    countryImages.find((country) => country.country === countryName)?.image || 'default-image.png'
  )
}

/**
 * Updates a single prediction in the model value based on the given prediction type.
 */
function updatePrediction(
  prediction: UserPrediction,
  predictionType: 'homePrediction' | 'awayPrediction',
): void {
  emit('update:modelValue', [
    ...props.modelValue.map((game) => {
      if (game.id === prediction.id) {
        return {
          ...game,
          [predictionType]: prediction[predictionType],
        }
      } else {
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
  const success = await predictionStore.savePredictions(props.modelValue)

  if (success) {
    if (authStore.user) {
      authStore.user.predictionActive = true
    }
  }
}

/**
 * Returns the home team name of a prediction, depending on the mode.
 * If the mode is 'add', it returns the homeTeam property of the prediction.
 * If the mode is 'view', it returns the homeTeam property of the game in the prediction.
 * @param prediction - The prediction to get the home team from.
 * @returns The home team name.
 */
function homeTeam(prediction: UserPrediction) {
  return props.mode === 'add' ? prediction.homeTeam : prediction.game.homeTeam
}

/**
 * Returns the away team name of a prediction, based on the current mode.
 *
 * When the mode is 'add', it retrieves the awayTeam property directly from the prediction object.
 * When the mode is 'view', it accesses the awayTeam property from the game object within the prediction.
 *
 * @param {UserPrediction} prediction - The prediction object containing team information.
 * @returns {string} - The name of the away team.
 */
function awayTeam(prediction: UserPrediction): string {
  // Depending on the mode, retrieve the away team name from either the prediction
  // object or the game object within the prediction.
  return props.mode === 'add' ? prediction.awayTeam : prediction.game.awayTeam
}

/**
 * Returns the formatted time of a prediction, depending on the mode.
 * If the mode is 'add', it formats the time from the prediction's dateTime property.
 * If the mode is 'view', it formats the time from the game's dateTime property in the prediction.
 *
 * @param prediction - The prediction to get the time from.
 * @returns The formatted time string.
 */

/**
 * Helper function to parse a datetime string into a Date object.
 *
 * @param {string} dateTime - The datetime string to parse.
 * @returns {Date} - The Date object.
 */
function parseDateTime(dateTime: string): Date {
  return new Date(dateTime)
}

/**
 * Formats a Date object into a date string like "1. janvāris".
 *
 * @param {Date} date - The Date object to format.
 * @returns {string} - The formatted date string.
 */
function formatDate(date: Date): string {
  return `${date.getUTCDate()}. ${date.toLocaleString('lv-LV', { month: 'long' })}`
}

/**
 * Formats a Date object into a time string like "15:30".
 *
 * @param {Date} date - The Date object to format.
 * @returns {string} - The formatted time string.
 */
function formatTime(date: Date): string {
  const pad = (num: number) => num.toString().padStart(2, '0')
  return `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`
}

/**
 * Extracts the Date object from a prediction based on the mode.
 *
 * @param {UserPrediction} prediction - The prediction object.
 * @param {'add' | 'view'} mode - The mode to determine the source of the datetime.
 * @returns {Date} - The Date object from the relevant datetime property.
 */
function getPredictionDate(prediction: UserPrediction, mode: 'add' | 'list'): Date {
  const dateTime = mode === 'add' ? prediction.dateTime : prediction.game.dateTime
  return parseDateTime(dateTime)
}

/**
 * Returns the formatted date string for a prediction based on the mode.
 *
 * @param {UserPrediction} prediction - The prediction object.
 * @param {'add' | 'view'} mode - The mode to determine the source of the datetime.
 * @returns {string} - The formatted date string.
 */
function getFormattedDate(prediction: UserPrediction, mode: 'add' | 'list'): string {
  return formatDate(getPredictionDate(prediction, mode))
}

/**
 * Returns the formatted time string for a prediction based on the mode.
 *
 * @param {UserPrediction} prediction - The prediction object.
 * @param {'add' | 'view'} mode - The mode to determine the source of the datetime.
 * @returns {string} - The formatted time string.
 */
function getFormattedTime(prediction: UserPrediction, mode: 'add' | 'list'): string {
  return formatTime(getPredictionDate(prediction, mode))
}
</script>

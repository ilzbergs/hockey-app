<template>
  <div class="flex flex-wrap justify-center gap-2 mt-4">
    <div
      v-for="predictiom in modelValue"
      :key="predictiom.id"
      class="flex w-[15rem] justify-around p-2 border rounded-md bg-slate-100 shadow-lg"
    >
      <div class="text-center items-center flex w-full flex-col">
        <div class="flex justify-between items-center w-full">
          <template v-for="(team, index) in ['home', 'away']" :key="team">
            <div
              class="flex w-full items-center justify-evenly"
              :class="team === 'away' ? 'flex-row-reverse' : ''"
            >
              <img
                :src="fetchCountryImage(predictiom.game[team + 'Team'])"
                :alt="predictiom.game[team + 'Team']"
                class="rounded-md w-[60px] h-[40px] object-cover"
              />
              <p class="text-xl font-bold">{{ predictiom[team + 'Prediction'] }}</p>
            </div>
            <span v-if="index === 0" class="text-xl font-bold">:</span>
          </template>
        </div>

        <div class="mt-4 text-md uppercase font-semibold text-gray-700">
          {{ predictiom.game.homeTeam }}
          <span class="text-sm text-gray-600 lowercase font-normal">vs</span>
          {{ predictiom.game.awayTeam }}
        </div>
        <div class="flex w-full justify-between px-2">
          <p class="text-sm text-gray-400">{{ formatTime(predictiom.game.dateTime) }}</p>
          <p class="text-sm text-gray-400">
            {{ formatDate(predictiom.game.dateTime) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import countryImages from '../data/flags'
import { UserPrediction } from '../stores/predictionStore'

// Props
defineProps({
  modelValue: {
    type: Array as () => UserPrediction[],
    required: true,
  },
})

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
 * Returns a formatted date string from a given datetime string.
 *
 * @param {string} dateTime - The datetime string to format.
 * @returns {string} The formatted date string.
 */
function formatDate(dateTime: string): string {
  const date = new Date(dateTime);
  return `${date.getUTCDate()}. ${date.toLocaleString('lv-LV', { month: 'long' })}`;
}

// const padStart = (num: number) => num.toString().padStart(2, '0');

/**
 * Returns a formatted time string from a given datetime string.
 *
 * @param {string} dateTime - The datetime string to format.
 * @returns {string} The formatted time string.
 */
function formatTime(dateTime: string): string {
  const date = new Date(dateTime);
  const padStartFunction = (num: number) => num.toString().padStart(2, '0');
  return `${padStartFunction(date.getUTCHours())}:${padStartFunction(date.getUTCMinutes())}`;
}

</script>

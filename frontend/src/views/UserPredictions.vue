<template>
  <!-- 🟢 BEFORE START -->
  <template v-if="!done">
    <!-- instrukcijas -->
    <BlurCard v-if="!authStore.user?.predictionActive"> instrukcijas </BlurCard>

    <BlurCard>
      <div v-if="isLoading">Ielādējas...</div>

      <div v-else>
        <!-- jau iesniedza -->
        <Predictions v-if="authStore.user?.predictionActive" mode="list" v-model="predictions" />

        <!-- vēl nav iesniedzis -->
        <Predictions v-else mode="add" v-model="games" />
      </div>
    </BlurCard>
  </template>

  <!-- 🔴 AFTER START -->
  <template v-else>
    <!-- JA lietotājs NAV iesniedzis -->
    <BlurCard v-if="!authStore.user?.predictionActive">
      <div class="text-center text-red-400 text-lg py-10 space-y-3">
        <p class="text-2xl font-bold">⏰ Tu esi nokavējis</p>

        <p class="text-gray-300">Prognožu iesniegšanas termiņš ir beidzies.</p>

        <p class="text-gray-400 text-sm">
          Šoreiz nepaspēji, bet nākamreiz būsi gatavs kā NHL drafta pirmais numurs 😄
        </p>

        <p class="text-yellow-400 text-sm font-medium">
          Tiekamies nākamajos hokeja čempionātos! 🏒
        </p>
      </div>
    </BlurCard>

    <!-- JA lietotājs IR iesniedzis -->
    <Predictions v-else mode="list" v-model="predictions" />
  </template>
</template>
<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useSettingsStore } from '../stores/settingsStore'
import { useAuthStore } from '../stores/authStore'
import { usePredictionsStore, type UserPrediction } from '../stores/predictionStore'
import { useGamesStore } from '../stores/gameStore'
import { useCountdown } from '../utils/useCountDown'

import Predictions from '../components/Predictions.vue'
import BlurCard from '../components/BlurCard.vue'

/* === stores === */
const authStore = useAuthStore()
const predictionStore = usePredictionsStore()
const gameStore = useGamesStore()
const settingsStore = useSettingsStore()

/* === state === */
const predictions = ref<UserPrediction[]>([])
const games = ref<any[]>([])

/* === loading === */
const isLoading = computed(() => predictionStore.isLoading || gameStore.isLoading)

/* === fetch settings === */
onMounted(async () => {
  await settingsStore.fetchSettings()
})
const settings = computed(() => {
  const data = settingsStore.settings
  return Array.isArray(data) ? data[0] : data
})

/**
 * 🧠 SAFE UTC DATE PARSER (FIXS +3h BUG)
 */
const parseUTCDate = (value: string | undefined): Date | null => {
  if (!value) return null
  // value nāk no PB formāta "2026-04-20 14:55:00.000Z"
  // noņem "Z" un uztaisi tā, lai new Date() netulko to kā UTC
  const iso = value.replace('Z', '').replace(' ', 'T')
  const date = new Date(iso)
  return isNaN(date.getTime()) ? null : date
}

/**
 * Start date (reactive + safe)
 */
const startDate = computed<Date | null>(() => {
  return parseUTCDate(settings.value?.championshipStart)
})

/**
 * Countdown
 */
const { done } = useCountdown(startDate)

const loadData = async () => {
  if (done.value) return

  if (authStore.user?.predictionActive) {
    predictions.value = await predictionStore.fetchUserPredictions()
  } else {
    games.value = await gameStore.fetchGames()
  }
}

/* reactive reload */
watch(() => [authStore.user?.predictionActive, done.value], loadData, { immediate: true })
</script>

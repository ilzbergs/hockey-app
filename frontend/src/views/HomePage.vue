<template>
  <!-- Content wrapper -->
  <div class="relative z-10 max-w-7xl mx-auto">
    <!-- Countdown -->
    <div class="flex justify-center mb-10">
      <TimeLeft />
    </div>

    <!-- HERO CARD -->
    <BlurCard>
      <h1 class="text-4xl md:text-5xl font-bold text-center mb-4">
        Pasaules čempionāta 2026 prognožu spēle
      </h1>

      <p class="text-center text-gray-200 text-lg max-w-2xl mx-auto mb-10">
        Prognozē spēļu iznākumus, krāj punktus un kāp līderu tabulā. Izvēlies uzvarētājus un
        sacenties ar citiem hokeja faniem Latvijā.
      </p>

      <!-- BTN -->
      <div class="flex justify-center gap-4 mb-12">
        <router-link
          to="/predictions"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold shadow-lg transition"
        >
          <p v-if="allPredictionsCompleted">Manas prognozes</p>
          <p v-else>Sākt prognozēt</p>
        </router-link>
      </div>

      <!-- BENEFITS SECTION -->
      <div class="grid md:grid-cols-3 gap-6 mb-14">
        <div class="p-6 bg-white/10 rounded-xl border border-white/10 text-center">
          <h3 class="text-xl font-semibold mb-2">Prognozē spēles</h3>
          <p class="text-gray-300 text-sm">
            Izvēlies uzvarētāju un paredzi rezultātu katrai spēlei.
          </p>
        </div>

        <div class="p-6 bg-white/10 rounded-xl border border-white/10 text-center">
          <h3 class="text-xl font-semibold mb-2">Pelni punktus</h3>
          <p class="text-gray-300 text-sm">Jo precīzākas prognozes, jo vairāk punktu saņem.</p>
        </div>

        <div class="p-6 bg-white/10 rounded-xl border border-white/10 text-center">
          <h3 class="text-xl font-semibold mb-2">Kāp līderos</h3>
          <p class="text-gray-300 text-sm">Salīdzini rezultātus un sacenties TOP tabulā.</p>
        </div>
      </div>

      <!-- HOW IT WORKS -->
      <div class="mb-12 max-w-3xl mx-auto">
        <h3 class="text-2xl font-bold mb-4 text-center">Kā tas darbojas?</h3>
        <ol class="space-y-3 text-gray-200 text-lg">
          <li>1. Izvēlies spēli un ievadi paredzēto rezultātu.</li>
          <li>2. Sagaidi oficiālo spēles rezultātu.</li>
          <li>3. Par precizitāti saņem atbilstošus punktus.</li>
          <li>4. Skaties savu vietu līderu tabulā.</li>
        </ol>
      </div>

      <!-- IMPORTANT INFO -->
      <div class="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-6 max-w-3xl mx-auto">
        <h3 class="text-xl font-semibold text-yellow-300 mb-2">Svarīgi zināt</h3>
        <ul class="text-gray-200 space-y-1">
          <li>• Tiek vērtēts tikai pamata laika rezultāts.</li>
          <li>• Prognozes var iesniegt vienu reizi.</li>
          <li>• Precīzs rezultāts dod papildu punktus.</li>
        </ul>
      </div>
    </BlurCard>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import TimeLeft from '../components/TimeLeft.vue'
import { usePredictionsStore } from '../stores/predictionStore'
import BlurCard from '../components/BlurCard.vue'

const predictionStore = usePredictionsStore()
const loading = ref(true)

onMounted(async () => {
  await predictionStore.fetchUserPredictions() // fetchē no backend
  loading.value = false
})

// Watch predictions, lai pārrēķinātu allPredictionsCompleted, kad dati ielādēti
const allPredictionsCompleted = computed(() => {
  if (loading.value) return false
  if (predictionStore.predictions.length === 0) return false

  return predictionStore.predictions.every(
    (p) => p.homePrediction !== null && p.awayPrediction !== null,
  )
})
</script>

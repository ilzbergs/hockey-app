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
      <p class="text-center text-gray-200 text-xl max-w-2xl mx-auto mb-10">
        Ienāc spēlē kā treneris, domā kā analītiķis un prognozē kā čempions. Katra spēle, katrs
        rezultāts un katrs punkts tuvina tevi līderu virsotnei.
      </p>

      <p class="text-center text-gray-200 text-lg max-w-2xl mx-auto mb-10">
        Prognozē spēļu iznākumus, krāj punktus un kāp līderu tabulā. Izvēlies uzvarētājus un
        sacenties ar citiem hokeja faniem Latvijā.
      </p>

      <!-- BTN -->
      <div class="flex justify-center gap-4 mb-12">
        <router-link to="/predictions" class="cta-btn">
          <span v-if="allPredictionsCompleted">📊 Apskatīt manas prognozes</span>
          <span v-else>🚀 Sākt prognozēt</span>
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
<style scoped>
.cta-btn {
  position: relative;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  color: white;

  background: linear-gradient(135deg, #1d4ed8, #3b82f6);
  box-shadow:
    0 8px 20px rgba(59, 130, 246, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);

  transition: all 0.3s ease;
  overflow: hidden;
}

.cta-btn:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow:
    0 12px 30px rgba(59, 130, 246, 0.6),
    0 0 20px rgba(59, 130, 246, 0.4);
}

/* light sweep */
.cta-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  opacity: 0;
  transition: 0.4s;
}

.cta-btn:hover::after {
  opacity: 1;
}
</style>

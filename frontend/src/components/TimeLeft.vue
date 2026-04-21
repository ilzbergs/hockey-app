<template>
  <div v-if="startDate && !done" class="flex flex-col items-center mt-8 countdown-wrapper">
    <!-- ANIMATED TITLE -->
    <div class="title-container mb-6">
      <p class="animated-title text-sm mb-1">Jau pavisam drīz</p>
      <div class="title-glow"></div>
    </div>

    <!-- ANIMATED GRID -->
    <div class="grid grid-cols-4 gap-4 max-w-md mx-auto countdown-grid">
      <div class="time-box" style="animation-delay: 0s">
        <div class="time-value">{{ parts?.days ?? 0 }}</div>
        <div class="time-label">{{ pluralizeLV(parts?.days ?? 0, 'diena', 'dienas') }}</div>
      </div>

      <div class="time-box" style="animation-delay: 0.2s">
        <div class="time-value">{{ parts?.hours ?? 0 }}</div>
        <div class="time-label">{{ pluralizeLV(parts?.hours ?? 0, 'stunda', 'stundas') }}</div>
      </div>

      <div class="time-box" style="animation-delay: 0.4s">
        <div class="time-value">{{ parts?.minutes ?? 0 }}</div>
        <div class="time-label">{{ pluralizeLV(parts?.minutes ?? 0, 'minūte', 'minūtes') }}</div>
      </div>

      <div class="time-box" style="animation-delay: 0.6s">
        <div class="time-value seconds-special">{{ parts?.seconds ?? 0 }}</div>
        <div class="time-label">{{ pluralizeLV(parts?.seconds ?? 0, 'sekunde', 'sekundes') }}</div>
      </div>
    </div>

    <!-- FLOATING BACKGROUND PARTICLES -->
    <div class="floating-particles">
      <span
        v-for="n in 8"
        :key="n"
        class="particle"
        :style="{ animationDelay: n * 0.5 + 's' }"
      ></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useSettingsStore } from '../stores/settingsStore'
import { useCountdown } from '../utils/useCountDown'

const settingsStore = useSettingsStore()

onMounted(async () => {
  await settingsStore.fetchSettings()
})

const settings = computed(() => {
  const data = settingsStore.settings
  return Array.isArray(data) ? data[0] : data
})

const startDate = computed(() => {
  const raw = settings.value?.championshipStart
  return raw ? new Date(raw) : null
})

const { parts, done } = useCountdown(startDate)

function pluralizeLV(value: number, singular: string, plural: string): string {
  const last = value % 10
  const lastTwo = value % 100
  if (last === 1 && lastTwo !== 11) return singular
  return plural
}
</script>

<style scoped>
/* ═══ WRAPPER ═══ */
.countdown-wrapper {
  position: relative;
  animation: fadeInScale 1.2s ease-out;
}

/* ═══ ANIMATED TITLE ═══ */
.title-container {
  position: relative;
  z-index: 10;
}

.animated-title {
  color: transparent;
  background: linear-gradient(45deg, #3b82f6, #6366f1, #8b5cf6, #06b6d4, #3b82f6);
  background-size: 300% 300%;
  background-clip: text;
  -webkit-background-clip: text;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  animation: gradientText 3s ease-in-out infinite;
  filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.4));
}

@keyframes gradientText {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.title-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 20px;
  background: radial-gradient(ellipse, rgba(59, 130, 246, 0.3), transparent);
  animation: pulseGlow 2s ease-in-out infinite;
  z-index: -1;
}

/* ═══ TIME BOXES ═══ */
.countdown-grid {
  animation: gridFadeIn 1s ease-out 0.5s both;
}

.time-box {
  width: 100px;
   height: 120px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px 12px;
  backdrop-filter: blur(10px);
display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  transition: all 0.3s ease;
  animation: boxFloat 6s ease-in-out infinite;
  position: relative;
  overflow: hidden;
}

.time-box::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.time-box:hover::before {
  opacity: 1;
}

.time-box:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow:
    0 12px 40px rgba(59, 130, 246, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/* ═══ TIME VALUES ═══ */
.time-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  animation: numberPulse 2s ease-in-out infinite;
}

.seconds-special {
  color: #3b82f6;
  animation: secondsTick 1s ease-in-out infinite;
}

.time-label {
  font-size: 11px;
  text-transform: uppercase;
  color: #94a3b8;
  margin-top: 8px;
  letter-spacing: 1.2px;
  font-weight: 500;
}

/* ═══ FLOATING PARTICLES ═══ */
.floating-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: -1;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, #3b82f6, transparent);
  border-radius: 50%;
  animation: float 8s linear infinite;
}

/* ═══ ANIMATIONS ═══ */
@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes gridFadeIn {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes boxFloat {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-6px);
  }
}

@keyframes numberPulse {
  0%,
  100% {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }
  50% {
    text-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
  }
}

@keyframes secondsTick {
  0% {
    color: #3b82f6;
    text-shadow: 0 0 10px rgba(59, 130, 246, 0.6);
  }
  50% {
    color: #06b6d4;
    text-shadow: 0 0 15px rgba(6, 182, 212, 0.8);
  }
  100% {
    color: #3b82f6;
    text-shadow: 0 0 10px rgba(59, 130, 246, 0.6);
  }
}

@keyframes pulseGlow {
  0%,
  100% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

@keyframes float {
  0% {
    transform: translateY(100vh) translateX(-10px);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) translateX(10px);
    opacity: 0;
  }
}

/* Random positioning for particles */
.particle:nth-child(1) {
  left: 10%;
}
.particle:nth-child(2) {
  left: 20%;
}
.particle:nth-child(3) {
  left: 30%;
}
.particle:nth-child(4) {
  left: 40%;
}
.particle:nth-child(5) {
  left: 50%;
}
.particle:nth-child(6) {
  left: 60%;
}
.particle:nth-child(7) {
  left: 70%;
}
.particle:nth-child(8) {
  left: 80%;
}
</style>

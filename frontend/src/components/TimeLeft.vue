<template>
  <div v-if="startDate && !done" class="flex flex-col items-center mt-8 countdown-wrapper">
    <!-- ANIMATED TITLE -->
    <div class="title-container mb-6">
      <p class="animated-title text-sm mb-1">Jau pavisam drīz</p>
      <div class="title-glow"></div>
    </div>

    <!-- ANIMATED GRID -->
    <div class="grid grid-cols-4 gap-1 sm:gap-2 w-full max-w-sm sm:max-w-md mx-auto countdown-grid">
      <div class="time-box" style="animation-delay: s">
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
import { computed } from 'vue'
import { useCountdown } from '../utils/useCountDown'

const startDate = computed(() => {
  const raw = import.meta.env.VITE_CHAMPIONSHIP_START
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
  width: 200px;
  height: 40px;
  background: radial-gradient(ellipse, rgba(138, 116, 122, 0.3), transparent);
  z-index: -1;
  border-radius: 20px;
}

.time-box {
  width: 100%;
  aspect-ratio: 5 / 6;

  max-width: 90px;
  padding: 10px 6px;

  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;

  backdrop-filter: blur(10px);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  transition: all 0.3s ease;
}

/* ═══ TIME VALUES ═══ */
.time-value {
  font-size: 1.7rem;
}

@media (min-width: 640px) {
  .time-value {
    font-size: 2.7rem;
  }
}

.time-label {
  font-size: 9px;
  letter-spacing: 0.8px;
}

@media (min-width: 640px) {
  .time-label {
    font-size: 11px;
    letter-spacing: 1.2px;
  }
}

.seconds-special {
  color: #3b82f6;
  animation: goalPulse 1s ease-in-out infinite;
}

@keyframes goalPulse {
  0% {
    transform: scale(1);
    text-shadow: 0 0 10px #3b82f6;
  }
  50% {
    transform: scale(1.2);
    text-shadow: 0 0 25px #06b6d4;
  }
  100% {
    transform: scale(1);
    text-shadow: 0 0 10px #3b82f6;
  }
}
</style>

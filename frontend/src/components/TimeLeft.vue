<template>
  <div
    v-if="!hasStarted"
    class="text-center text-lg text-gray-600 flex flex-col items-center justify-center mt-4"
  >
    <p class="text-white">Līdz prognožu spēles sākumam:</p>
    <span class="font-semibold text-red-400 text-2xl">{{ timeLeft }}</span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  startDate: {
    type: Date,
    required: true,
  },
})

const timeLeft = ref('')
const hasStarted = ref(false)

function formatUnit(count: number, singular: string, plural: string): string {
  return count % 10 === 1 && count % 100 !== 11 ? singular : plural
}

function updateTimeLeft(): void {
  const now = Date.now()
  const diff = props.startDate.getTime() - now

  if (diff <= 0) {
    hasStarted.value = true
    timeLeft.value = ''
    return
  }

  const msInDay = 1000 * 60 * 60 * 24
  const msInHour = 1000 * 60 * 60
  const msInMinute = 1000 * 60

  const days = Math.floor(diff / msInDay)
  const hours = Math.floor((diff % msInDay) / msInHour)
  const minutes = Math.floor((diff % msInHour) / msInMinute)

  const dayText = days > 0 ? `${days} ${formatUnit(days, 'diena', 'dienas')}, ` : ''
  const hourText = `${hours} ${formatUnit(hours, 'stunda', 'stundas')}`
  const minuteText = `${minutes} ${formatUnit(minutes, 'minūte', 'minūtes')}`

  timeLeft.value = `${dayText}${hourText} un ${minuteText}`
}

let interval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  updateTimeLeft()
  interval = setInterval(updateTimeLeft, 1000)
})

onUnmounted(() => {
  if (interval !== null) {
    clearInterval(interval)
  }
})
</script>

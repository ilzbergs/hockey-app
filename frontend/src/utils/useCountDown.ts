import { ref, onMounted, onUnmounted, watch, type Ref } from 'vue'
import { getTimeLeft, type CountdownParts } from './time'

type UseCountdownReturn = {
  parts: Ref<CountdownParts | null>
  done: Ref<boolean>
}

/**
 * Simple countdown composable
 */
export function useCountdown(startDate: Ref<Date | string | null>): UseCountdownReturn {
  const parts = ref<CountdownParts | null>(null)
  const done = ref(false)

  let interval: ReturnType<typeof setInterval> | null = null

  function update() {
    if (!startDate.value) return

    try {
      const result = getTimeLeft(startDate.value)

      parts.value = result.parts
      done.value = result.done
    } catch (e) {
      console.error('Countdown error:', e)
      parts.value = null
      done.value = true
    }
  }

  onMounted(() => {
    update()

    interval = setInterval(update, 1000)
  })

  watch(startDate, () => {
    update()
  })

  onUnmounted(() => {
    if (interval) clearInterval(interval)
  })

  return {
    parts,
    done,
  }
}

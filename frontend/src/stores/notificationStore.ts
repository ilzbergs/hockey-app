import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const message = ref<string | null>(null)
  const severity = ref<'error' | 'success' | null>(null)

  const setErrorNotification = (msg: string) => {
    message.value = msg
    severity.value = 'error'
  }

  const setSuccessNotification = (msg: string) => {
    message.value = msg
    severity.value = 'success'
  }

  const clearNotification = () => {
    message.value = null
    severity.value = null
  }

  return {
    message,
    severity,
    setErrorNotification,
    setSuccessNotification,
    clearNotification,
  }
})

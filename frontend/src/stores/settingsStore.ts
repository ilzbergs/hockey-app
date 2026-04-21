import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNotificationStore } from './notificationStore'

export interface Settings {
  id: string
  championshipStart: string
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<Settings | null>(null)
  const isLoading = ref(false)
  const notificationStore = useNotificationStore()

  /**
   * Fetches application settings from the backend.
   *
   * @returns {Promise<Settings | null>}
   */
  const fetchSettings = async (): Promise<Settings | null> => {
    isLoading.value = true

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/settings`, {
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        notificationStore.setErrorNotification(errorData.message)
        return null
      }

      const data: Settings = await response.json()

      settings.value = data
      console.log('STORE', settings.value)

      return data
    } catch (error) {
      notificationStore.setErrorNotification('Neizdevās ielādēt sākumās datuma iestatījumus')
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    settings,
    isLoading,
    fetchSettings,
  }
})

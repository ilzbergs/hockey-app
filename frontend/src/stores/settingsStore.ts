import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNotificationStore } from './notificationStore'

export interface Settings {
  championshipStart: string
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<Settings | null>(null)
  const isLoading = ref(false)
  const notificationStore = useNotificationStore()

  /**
   * Generic API helper (same pattern as gamesStore)
   */
  const api = async (url: string, options?: RequestInit) => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}${url}`, {
      credentials: 'include',
      ...options,
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      throw new Error(data?.message || 'API error')
    }

    return data
  }

  /**
   * Fetch settings
   */
  const fetchSettings = async (): Promise<Settings | null> => {
    isLoading.value = true

    try {
      const data = await api('/settings')
      settings.value = data
      return data
    } catch (err: any) {
      notificationStore.setErrorNotification(err.message)
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

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { User } from './userStore'
import { Game } from './gameStore'
import { useAuthStore } from './authStore'
import { useNotificationStore } from './notificationStore'

// Define the UserPrediction interface to structure prediction data
export interface UserPrediction {
  awayScore: string
  gameRef: number
  awayTeam: string
  homeTeam: string
  dateTime: string
  id: string
  user: User
  game: Game
  homePrediction: number | null
  awayPrediction: number | null
  points: number | null
}

// Define the predictions store
export const usePredictionsStore = defineStore('predictions', () => {
  const predictions = ref<UserPrediction[]>([])
  const isLoading = ref(false)
  const authStore = useAuthStore()
  const notificationStore = useNotificationStore()

  /**
   * Fetches the list of predictions from the server.
   *
   * @returns {Promise<UserPrediction[]>} Resolves to the list of predictions fetched from the server.
   */
  const fetchUserPredictions = async (): Promise<UserPrediction[]> => {
    if (!authStore.isAuthenticated) {
      return []
    }
    isLoading.value = true
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/predictions`, {
        credentials: 'include',
      })

      if (!response.ok) {
        const { message } = await response.json()
        notificationStore.setErrorNotification(message)
        predictions.value = []
        return []
      }

      const data: UserPrediction[] = await response.json()
      predictions.value = data || []
      return data
    } catch (error) {
      predictions.value = []
      notificationStore.setErrorNotification('Failed to fetch predictions')
      return []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Saves the user predictions to the server.
   *
   * @param {UserPrediction[]} predictions - The predictions data to be saved.
   * @returns {Promise<boolean>} Resolves to true if saving was successful, false otherwise.
   */
  const saveUserPredictions = async (predictions: UserPrediction[]): Promise<boolean> => {
    isLoading.value = true
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/predictions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(predictions),
      })

      if (!response.ok) {
        const { message } = await response.json()
        notificationStore.setErrorNotification(message)
        return false
      }

      notificationStore.setSuccessNotification('Prognozes saglabātas veiksmīgi!')
      
      await fetchUserPredictions()
      return true
    } catch (error) {
      notificationStore.setErrorNotification('Neizdevās saglabāt prognozes')
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetches all user predictions from the server.
   *
   * @returns {Promise<UserPrediction[]>} Resolves to the list of all user predictions.
   */
  const listAllUsersPredictions = async (): Promise<UserPrediction[]> => {
    isLoading.value = true
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/predictions/all`, {
        credentials: 'include',
      })

      if (!response.ok) {
        const { message } = await response.json()
        notificationStore.setErrorNotification(message)
      }

      const data: UserPrediction[] = await response.json()
      return data || [] // Return the fetched predictions or an empty array if no data
    } catch (error) {
      notificationStore.setErrorNotification('Neizdevās iegūt visu lietotāju prognozes')
      return []
    } finally {
      isLoading.value = false
    }
  }

  return {
    predictions,
    isLoading,
    fetchUserPredictions,
    saveUserPredictions,
    listAllUsersPredictions,
  }
})

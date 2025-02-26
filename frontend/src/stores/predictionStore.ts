import { defineStore } from 'pinia'
import { ref } from 'vue'
import { User } from './userStore'
import { Game } from './gameStore'
import { nextTick } from 'vue'

// Define the UserPrediction interface to structure prediction data
export interface UserPrediction {
  awayScore: any
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
  const errorMessage = ref<string | null>(null)

  /**
   * Fetches the list of predictions from the server.
   *
   * @returns {Promise<UserPrediction[]>} Resolves to the list of predictions fetched from the server.
   */
  const fetchPredictions = async (): Promise<UserPrediction[]> => {
    isLoading.value = true
    errorMessage.value = null

    try {
      const response = await fetch('http://localhost:3000/prediction', {
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        errorMessage.value = errorData.message
        console.error('Failed to fetch predictions:', errorData)
        predictions.value = []
        return []
      }

      const data: UserPrediction[] = await response.json()
      predictions.value = data || []
      return data
    } catch (error: any) {
      console.error('Error fetching predictions:', error)
      errorMessage.value = 'Kaut kas nogāja greizi, mēģini vēlreiz!'
      predictions.value = []
      return []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Saves the user predictions to the server.
   *
   * @param {UserPrediction[]} predictionsData - The predictions data to be saved.
   * @returns {Promise<boolean>} Resolves to true if saving was successful, false otherwise.
   */
  const savePredictions = async (predictionsData: UserPrediction[]): Promise<boolean> => {
    isLoading.value = true
    try {
      const response = await fetch('http://localhost:3000/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(predictionsData),
      })

      if (!response.ok) {
        throw new Error('Failed to save predictions')
      }

      // Refresh the predictions list after saving
      await fetchPredictions()
      return true
    } catch (error) {
      console.error('Error saving predictions:', error)
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
      const response = await fetch('http://localhost:3000/predictions/all', {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch all user predictions')
      }

      const data: UserPrediction[] = await response.json()
      return data || [] // Return the fetched predictions or an empty array if no data
    } catch (error) {
      console.error('Error fetching all user predictions:', error)
      return []
    } finally {
      isLoading.value = false
    }
  }

  return {
    predictions,
    isLoading,
    errorMessage,
    fetchPredictions,
    savePredictions,
    listAllUsersPredictions,
  }
})

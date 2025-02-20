import { defineStore } from 'pinia'
import { ref } from 'vue'
import { User } from './userStore'
import { Game } from './gameStore'

export interface UserPrediction {
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

export const usePredictionsStore = defineStore('predictions', () => {
  const predictions = ref<UserPrediction[]>([])
  const isLoading = ref(false)

  // Funkcija, lai pievienotu loading indikatoru un veiktu datus pieprasījumu
 const fetchPredictions = async (): Promise<UserPrediction[]> => {
   isLoading.value = true
   try {
     const response = await fetch('http://localhost:3000/predictions', {
       credentials: 'include',
     })

     if (!response.ok) {
       console.error('Failed to fetch predictions:', await response.json())
       predictions.value = []
       return [] // Atgriež tukšu masīvu
     }

     const data: UserPrediction[] = await response.json()
     predictions.value = data || []
     return data // Atgriež datus, nevis void
   } catch (error) {
     console.error('Error fetching predictions:', error)
     predictions.value = []
     return [] // Atgriež tukšu masīvu gadījumā, ja kļūda
   } finally {
     isLoading.value = false
   }
 }

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

      // Atsvaidzināt prognozes pēc saglabāšanas
      await fetchPredictions()
      return true
    } catch (error) {
      console.error('Error saving predictions:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const listAllUsersPredictions = async () => {
    isLoading.value = true
    try {
      const response = await fetch('http://localhost:3000/predictions/all', {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch all user predictions')
      }

      const data: UserPrediction[] = await response.json()
      return data || []
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
    fetchPredictions,
    savePredictions,
    listAllUsersPredictions,
  }
})

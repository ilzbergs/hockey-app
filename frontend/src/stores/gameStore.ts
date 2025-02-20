import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Game {
  id: string
  gameRef: number
  dateTime: string
  homeTeam: string
  awayTeam: string
  homeScore: number | null
  awayScore: number | null
}

export const useGamesStore = defineStore('games', () => {
  const games = ref<Game[]>([])
  const isLoading = ref(false) // Izveidojam loading mainīgo

  // Funkcija datu ielādei ar loading atbalstu
  const fetchGames = async (): Promise<Game[]> => {
    isLoading.value = true // Kad sākam ielādēt datus, iestatām loading uz true
    try {
      const response = await fetch('http://localhost:3000/games', {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Error fetching games')
      }

      const data: Game[] = await response.json()
      games.value = data
      return data // Atgriežam datus
    } catch (error) {
      console.error('Error fetching games:', error)
      return [] // Ja ir kļūda, atgriežam tukšu masīvu
    } finally {
      isLoading.value = false // Kad datu ielāde ir pabeigta, iestatām loading uz false
    }
  }

  // Funkcija spēles rezultāta atjaunināšanai
  const updateGameScore = async (gameId: string, homeScore: number, awayScore: number) => {
    try {
      const response = await fetch('http://localhost:3000/games/update-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ gameId, homeScore, awayScore }),
      })

      if (!response.ok) {
        throw new Error('Failed to update game score')
      }
      await fetchGames() // Atsvaidzinām spēļu sarakstu pēc rezultāta atjaunināšanas
      return true
    } catch (error) {
      console.error('Error updating game score:', error)
      return false
    }
  }

  return {
    games,
    fetchGames,
    updateGameScore,
    isLoading,
  }
})

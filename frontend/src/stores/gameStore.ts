import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNotificationStore } from './notificationStore'

// Define the Game interface to structure game data
export interface Game {
  id: string
  gameRef: number
  dateTime: string
  homeTeam: string
  awayTeam: string
  homeScore: number | null
  awayScore: number | null
  isUpdated: boolean
}

// Define the games store
export const useGamesStore = defineStore('games', () => {
  const games = ref<Game[]>([])
  const isLoading = ref(false)
  const notificationStore = useNotificationStore()

  /**
   * Fetches the list of games from the server.
   *
   * @returns {Promise<Game[]>} Resolves to the list of games fetched from the server.
   */
  const fetchGames = async (): Promise<Game[]> => {
    isLoading.value = true
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/games`, {
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        notificationStore.setErrorNotification(errorData.message)
        return []
      }

      const data: Game[] = await response.json()
      games.value = data
      return data
    } catch (error) {
      notificationStore.setErrorNotification('Neizdevās ielādēt spēles')
      return []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Updates the score of a specific game.
   *
   * @param {string} gameId - The ID of the game to update.
   * @param {number} homeScore - The updated home team score.
   * @param {number} awayScore - The updated away team score.
   * @returns {Promise<boolean>} Resolves to true if the score update was successful, false otherwise.
   */
  const updateGameScore = async (
    gameId: string,
    homeScore: number,
    awayScore: number,
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/games/update-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, homeScore, awayScore }),
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        notificationStore.setErrorNotification(errorData.message)
        return false
      }

      const data = await response.json()
      notificationStore.setSuccessNotification(data.message)
      // Fetch the games again to update the list
      await fetchGames()
      return true
    } catch (error) {
      notificationStore.setErrorNotification('Neizdevās atjaunināt spēles rezultātu')
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
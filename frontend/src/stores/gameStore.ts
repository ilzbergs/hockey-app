import { defineStore } from 'pinia'
import { ref } from 'vue'

// Define the Game interface to structure game data
export interface Game {
  id: string
  gameRef: number
  dateTime: string
  homeTeam: string
  awayTeam: string
  homeScore: number | null
  awayScore: number | null
}

// Define the games store
export const useGamesStore = defineStore('games', () => {
  const games = ref<Game[]>([])
  const isLoading = ref(false)

  /**
   * Fetches the list of games from the server.
   *
   * @returns {Promise<Game[]>} Resolves to the list of games fetched from the server.
   */
  const fetchGames = async (): Promise<Game[]> => {
    isLoading.value = true
    try {
      const response = await fetch('http://localhost:3000/games', {
        credentials: 'include',
      })

      if (!response.ok) {
        console.error('Error fetching games:', await response.text())
        return []
      }

      const data: Game[] = await response.json()
      games.value = data
      return data // Return the fetched games
    } catch (error) {
      console.error('Error fetching games:', error)
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
      const response = await fetch('http://localhost:3000/games/update-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, homeScore, awayScore }),
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to update game score')
      }

      // Refresh the list of games after the score update
      await fetchGames()
      return true // Return true if score update was successful
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

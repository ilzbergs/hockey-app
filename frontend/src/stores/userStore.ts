import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './authStore'
import { useRouter } from 'vue-router'

// Define the User interface to structure user data
export interface User {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
  predictionActive: boolean
  role: string
}

// Define the user store
export const useUserStore = defineStore('user', () => {
  const isLoading = ref(false)
  const router = useRouter()
  const authStore = useAuthStore()

  /**
   * Retrieve the user data from the server.
   *
   * @returns {Promise<boolean>} Resolves to true if data is successfully fetched, false otherwise.
   */
  const retrieveUserData = async (): Promise<boolean> => {
    isLoading.value = true
    try {
      const response = await fetch('http://localhost:3000/user', {
        method: 'GET',
        credentials: 'include', // Include cookies for session handling
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Failed to fetch user data:', errorData)
        authStore.logout() // Logout if user data fetching fails
        return false
      }

      const userData = await response.json()
      authStore.setAuthStatus(userData) // Update auth store with user data
      return true
    } catch (error) {
      console.error('Error fetching user data:', error)
      authStore.logout() // Logout in case of an error
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Signup a new user and log them in.
   *
   * @param userData The user data to register.
   * @returns {Promise<boolean>} Resolves to true if registration is successful, false otherwise.
   */
  const signupUser = async (userData: Partial<User>): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:3000/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Failed to register user:', errorData)
        return false
      }

      // Extract user data from the response and set authentication status
      const { user } = await response.json()
      authStore.setAuthStatus(user)

      // Redirect the user to the home page after successful registration
      router.push('/home')
      return true
    } catch (error) {
      console.error('Error registering user:', error)
      return false
    }
  }

  return {
    isLoading,
    retrieveUserData,
    signupUser,
  }
})

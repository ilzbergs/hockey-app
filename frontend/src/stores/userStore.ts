import { defineStore } from 'pinia'
import { useAuthStore } from './authStore'
import { useRouter } from 'vue-router'
import { useNotificationStore } from './notificationStore'

// Define the User interface to structure user data
export interface User {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
  predictionActive: boolean
  role: string
  config?: {
    championshipStart: string
  }
}

// Define the user store
export const useUserStore = defineStore('user', () => {
  const router = useRouter()
  const authStore = useAuthStore()
  const notificationStore = useNotificationStore()

  /**
   * Signup a new user and log them in.
   *
   * @param {Partial<User>} userData The user data to register.
   * @returns {Promise<boolean>} Resolves to true if registration is successful, false otherwise.
   */
  const signupUser = async (userData: Partial<User>): Promise<boolean> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        credentials: 'include',
      })

      if (!response.ok) {
        const { message } = await response.json()
        notificationStore.setErrorNotification(message)
        return false
      }

      // Extract user data from the response and set authentication status
      const { user } = await response.json()
      authStore.setAuthStatus(user)

      notificationStore.setSuccessNotification('Lietotājs veiksmīgi reģistrēts')

      // Redirect the user to the home page after successful registration
      router.push('/home')
      return true
    } catch (error) {
      console.error('Signup error:', error)
      notificationStore.setErrorNotification('Neizdevās reģistrēt lietotāju')
      return false
    }
  }

  return {
    signupUser,
  }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { User } from './userStore'
import { useRouter } from 'vue-router'
import { useNotificationStore } from './notificationStore'

// Define the authentication store
export const useAuthStore = defineStore('auth', () => {
  const isLoading = ref(false)
  const isAuthenticated = ref(false) // Tracks if the user is authenticated
  const user = ref<User | null>(null) // Stores user data
  const router = useRouter()
  const notificationStore = useNotificationStore()

  /**
   * Updates the authentication status and stores user data.
   *
   * @param {User} userData - The user data to set, indicating successful authentication.
   */
  const setAuthStatus = (userData: User) => {
    user.value = userData
    isAuthenticated.value = true
  }

  /**
   * Authenticates the user by sending login credentials to the server.
   *
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<boolean>} Returns true if login is successful, otherwise false.
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    isLoading.value = true
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        notificationStore.setErrorNotification(errorData.message)
        return false
      }

      // Tikai pēc veiksmīga login izsaucam fetchUserData()
      const data = await response.json()
      notificationStore.setSuccessNotification(data.message)

      const userFetched = await fetchUserData()
      if (!userFetched) {
        notificationStore.setErrorNotification('Neizdevās ielādēt lietotāja datus')
        return false
      }

      router.push('/home')
      return true
    } catch (error: any) {
      notificationStore.setErrorNotification('Neizdevās pieslēgties, mēģini vēlreiz!')
      console.error('Login error:', error.message)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetches the user data from the server. If the request fails, checks if the error is
   * due to an unauthorized request (401) and logs the user out if so.
   *
   * @returns {Promise<boolean>} Resolves to true if the user data is successfully fetched, false otherwise.
   */
  const fetchUserData = async (): Promise<boolean> => {
    isLoading.value = true
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user`, {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) {
        let errorMessage = 'Nezināma kļūda1'

        try {
          const errorData = await response.json()
          errorMessage = errorData.message || 'Servera kļūda'
        } catch (jsonError) {
          console.warn('Nevarēja parsēt servera kļūdas ziņojumu:', jsonError)
        }

        notificationStore.setErrorNotification(errorMessage)
        return false
      }

      user.value = await response.json()
      isAuthenticated.value = true
      return true
    } catch (error) {
      console.error('Tīkls vai serveris nav pieejams:', error)
      notificationStore.setErrorNotification('Neizdevās ielādēt lietotāja datus')
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Logs out the currently authenticated user by sending a request to the server.
   * Clears authentication state on success.
   *
   * @returns {Promise<void>} A promise that resolves when the logout process is complete.
   */
  const logout = async (): Promise<void> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        notificationStore.setErrorNotification(errorData.message)
        return
      }

      const data = await response.json()
      notificationStore.setSuccessNotification(data.message)
      // Clear authentication state on successful logout
      isAuthenticated.value = false
      user.value = null
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      notificationStore.setErrorNotification('Neizdevās izlogoties, mēģini vēlreiz!')
    }
  }

  return {
    isAuthenticated,
    fetchUserData,
    user,
    setAuthStatus,
    login,
    logout,
  }
})

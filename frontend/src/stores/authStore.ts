import { defineStore } from 'pinia'
import { ref } from 'vue'
import { User } from './userStore'
import { useRouter } from 'vue-router'

// Define the authentication store
export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false) // Tracks if the user is authenticated
  const user = ref<User | null>(null) // Stores user data
  const router = useRouter()

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
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      if (!response.ok) {
        console.error('Authentication failed:', response.statusText)
        return false
      }

      const data = await response.json()

      // Update authentication state with user details
      setAuthStatus({ ...data.user, role: data.role })
      router.push('/home')
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
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
      const response = await fetch('http://localhost:3000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        console.error('Logout failed:', await response.json())
        return
      }

      // Clear authentication state on successful logout
      isAuthenticated.value = false
      user.value = null
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return {
    isAuthenticated,
    user,
    setAuthStatus,
    login,
    logout,
  }
})

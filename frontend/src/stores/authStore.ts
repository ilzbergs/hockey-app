import { defineStore } from 'pinia'
import { ref } from 'vue'
import { User } from './userStore'
import router from '../router'
// import { useRouter } from 'vue-router'
import { useNotificationStore } from './notificationStore'

// Define the authentication store
export const useAuthStore = defineStore('auth', () => {
  const isLoading = ref(false)
  const isAuthenticated = ref(false) // Tracks if the user is authenticated
  const user = ref<User | null>(null) // Stores user data
  // const router = useRouter()
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

      const data = await response.json()

      if (!response.ok) {
        notificationStore.setErrorNotification(data.message || 'Neizdevās pieslēgties.')
        return false
      }

      // 1️⃣ Sinhronizē Pinia state ar backend
      const userFetched = await fetchUserData()
      if (!userFetched) {
        notificationStore.setErrorNotification('Neizdevās ielādēt lietotāja datus pēc login')
        return false
      }

      // 2️⃣ Tikai pēc state update → navigē
      notificationStore.setSuccessNotification(data.message || 'Pieslēgšanās veiksmīga')
      router.push('/home')
      return true
    } catch (error: any) {
      console.error('Login error:', error.message)
      notificationStore.setErrorNotification('Neizdevās pieslēgties, mēģini vēlreiz!')
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

      // Pārbauda, vai atbilde ir veiksmīga, pirms mēģina to izmantot
      if (!response.ok) {
        return false
      }

      const data = await response.json() // Tikai pēc tam, kad ir apstiprināts, ka atbilde ir veiksmīga
      user.value = data // Ielādē lietotāja datus
      // Atjauno autentifikācijas statusu
      isAuthenticated.value = true
      return true
    } catch (error) {
      console.error('Failed to fetch user data:', error) // Izvada kļūdas logu
      notificationStore.setErrorNotification('Neizdevās ielādēt lietotāja datus') // Lietotājam izvada vispārīgu kļūdas ziņojumu
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

  const initAuth = async (): Promise<void> => {
    // Ja ir cookie, backend atgriezīs user
    const ok = await fetchUserData()

    if (!ok) {
      isAuthenticated.value = false
      user.value = null
    }
  }

  const resetPassword = async (
    token: string,
    password: string,
    passwordConfirm: string,
  ): Promise<void> => {
    isLoading.value = true
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, passwordConfirm }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Neizdevās nomainīt paroli')
      notificationStore.setSuccessNotification(data.message)
      router.push('/')
    } catch (err: any) {
      console.error('Reset password error:', err)
      notificationStore.setErrorNotification(err.message)
    } finally {
      isLoading.value = false
    }
  }

  const requestPasswordReset = async (email: string): Promise<void> => {
    isLoading.value = true
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/request-password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Neizdevās nosūtīt e-pastu')
      notificationStore.setSuccessNotification(data.message)
    } catch (err: any) {
      console.error('Forgot password error:', err)
      notificationStore.setErrorNotification(err.message)
    } finally {
      isLoading.value = false
    }
  }

  return {
    isAuthenticated,
    fetchUserData,
    user,
    setAuthStatus,
    login,
    logout,
    initAuth,
    resetPassword,
    requestPasswordReset,
  }
})

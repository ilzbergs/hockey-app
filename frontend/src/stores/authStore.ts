import { defineStore } from 'pinia'
import { ref } from 'vue'
import { User } from './userStore'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false) // Authentication status
  const user = ref<User | null>(null) // User data

  const setAuthStatus = (userData: User) => {
    console.log('User data:', userData);
    user.value = userData
    isAuthenticated.value = true
  }

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        const userData = {
          ...data.user,
          role: data.role,
        }

        setAuthStatus(userData)
        return true
      } else {
        console.error('Authentication error:', await response.json())
        return false
      }
    } catch (error) {
      console.error('Network or server error:', error)
      return false
    }
  }

  // Logout function
  const logout = () => {
    isAuthenticated.value = false
    user.value = null
  }

  return {
    isAuthenticated,
    user,
    setAuthStatus,
    login,
    logout,
  }
})

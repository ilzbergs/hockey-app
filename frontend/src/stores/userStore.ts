import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './authStore'

export interface User {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
  predictionActive: boolean
  role: string
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  // Function to fetch user data using the token
  const fetchUser = async () => {
       isLoading.value = true
    const authStore = useAuthStore()
    try {
      const response = await fetch('http://localhost:3000/user', {
        method: 'GET',
        credentials: 'include',
      })

      if (response.ok) {
        const userData = await response.json()
        user.value = userData
        authStore.setAuthStatus(userData)
        return true
      } else {
        console.error('Failed to fetch user data:', await response.json())
        user.value = null
        authStore.logout()
        return false
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      user.value = null
      authStore.logout()
      return false
    }
    finally {
      isLoading.value = false
    }
  }

  const createUser = async (initialValues: User[]) => {
    try {
      const response = await fetch('http://localhost:3000/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(initialValues),
      })

      if (!response.ok) {
        throw new Error('Error adding user')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return {
    user,
    isLoading,
    fetchUser,
    createUser,
  }
})

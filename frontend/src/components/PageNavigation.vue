<template>
  <Menubar
    ref="menubar"
    :model="items"
    style="background-color: #a2aaad"
    :pt="{ itemIcon: { class: '!text-gray-900' },root: { class: '!border-0 !rounded-none' } }"
  >
    <template #start>
      <img :src="icon" alt="icon" style="width: 3rem; height: 3rem" />
    </template>
    <template #end>
      <div class="flex items-center gap-2">
        <span class="pi pi-user"></span>
        <p class="text-md">{{ authStore.user?.firstName + ' ' + authStore.user?.lastName }}</p>
        <Button label="Iziet" icon="pi pi-sign-out" @click="logout" severity="secondary" />
      </div>
    </template>
  </Menubar>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Menubar, Button } from 'primevue'
import { useRouter } from 'vue-router'
import icon from '../assets/images/icon.png'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const menubar = ref()

const items = ref([
  {
    label: 'Sākums',
    icon: 'pi pi-home',
    command: () => router.push('/home'),
  },
  {
    label: 'Prognozes',
    icon: 'pi pi-tags',
    command: () => router.push('/predictions'),
  },
  {
    label: 'Turnīra tabula',
    icon: 'pi pi-clipboard',
    command: () => router.push('/summary'),
  },
  // Only admin can see this
  {
    label: 'Spēļu rezultāti',
    icon: 'pi pi-pen-to-square',
    command: () => router.push('/results'),
    visible: computed(() => authStore.user?.role === 'admin'),
  },
])

async function logout() {
  try {
    const response = await fetch('http://localhost:3000/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    if (response.ok) {
      console.log('User logged out successfully.')
      router.push('/')
    } else {
      const errorData = await response.json()
      console.error('Logout failed:', errorData)
      alert('Logout failed. Please try again.')
    }
  } catch (error) {
    console.error('Network error during logout:', error)
    alert('Network error. Please try again.')
  }
}
</script>

<template>
  <Menubar
    ref="menubar"
    :model="items"
    style="background-color: #6b7280"
    :pt="{ itemIcon: { class: '!text-black' }, root: { class: '!border-0 !rounded-none' } }"
  >
    <template #start>
      <img :src="icon" alt="icon" style="width: 3rem; height: 3rem" />
    </template>
    <template #end>
      <div class="flex items-center gap-3">
        <span class="pi pi-user"></span>
        <p class="text-md">
          {{ authStore.user?.firstName + ' ' + authStore.user?.lastName }}
        </p>
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

// Define tme menu items for the navigation bar
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

/**
 * Logs the user out by calling the logout method from the auth store.
 * After successful logout, it updates the application state accordingly.
 */

async function logout() {
  await authStore.logout()
}
</script>

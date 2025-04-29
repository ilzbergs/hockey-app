<template>
  <div class="min-h-screen">
    <!-- Navigation is fixed at the top -->
    <Navigation v-if="shouldShowMenuBar" class="" />
    <!-- Scrollable content -->
    <div class="relative flex-grow overflow-y-auto">
      <router-view />
    </div>
  </div>
  <!-- Toasts -->
  <Toast position="bottom-right" />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, watch } from 'vue'

import { useToast } from 'primevue/usetoast'

const toast = useToast()

import Navigation from './components/PageNavigation.vue'
import { useNotificationStore } from './stores/notificationStore'
const route = useRoute()

const notificationStore = useNotificationStore()

watch(
  () => notificationStore.message,
  (newVal) => {
    if (newVal) {
      toast.add({
        severity: notificationStore.severity || 'info',
        detail: newVal,
        life: 3000,
      })
      notificationStore.clearNotification()
    }
  },
)

// Define a computed property to determine if MenuBar should be shown
const shouldShowMenuBar = computed(() => {
  // MenuBar is hidden for specific routes
  const hiddenRoutes = ['login', 'register', 'not-found']
  return !hiddenRoutes.includes(route.name as string)
})
</script>

<template>
  <div class="app-wrapper min-h-screen text-white relative overflow-hidden">
    <!-- Background -->
    <div class="app-bg"></div>
    <div class="app-overlay"></div>

    <!-- Content layer -->
    <div class="relative z-10 flex flex-col min-h-screen">
      <!-- Navigation -->
      <Navigation v-if="shouldShowMenuBar" />

      <!-- Scrollable content -->
      <main class="flex-1 overflow-y-auto mt-24">
        <router-view />
      </main>

      <!-- Footer -->
      <Footer v-if="shouldShowMenuBar" />

      <!-- Toast -->
      <Toast
        position="bottom-right"
        class="!right-4 !left-auto sm:!max-w-sm !w-[90vw] sm:!w-auto"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, watch } from 'vue'
import Footer from './components/Footer.vue'
import Navigation from './components/PageNavigation.vue'
import { useToast } from 'primevue/usetoast'
import { useNotificationStore } from './stores/notificationStore'

const toast = useToast()
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

const shouldShowMenuBar = computed(() => {
  const hiddenRoutes = ['login', 'register', 'not-found', 'forgot-password', 'reset-password']
  return !hiddenRoutes.includes(route.name as string)
})
</script>

<style scoped>
.app-wrapper {
  position: relative;
}

/* Background image visible on all pages */
.app-bg {
  position: fixed;
  inset: 0;
  background-image: url('@/assets/images/homeBG2.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed; /* premium parallax effect */
  z-index: 1;
}

/* Dark overlay to improve readability */
.app-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(2px);
  z-index: 2;
}
</style>

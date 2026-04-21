<template>
  <div class="min-h-screen text-white relative overflow-hidden">
    <!-- Background -->
    <div :class="['app-bg', isAuthPage ? 'auth-bg' : 'main-bg']"></div>
    <div class="app-overlay"></div>

    <!-- Content layer -->
    <div class="relative z-10 flex flex-col min-h-screen">
      <!-- Navigation -->
      <Navigation v-if="shouldShowMenuBar" />

      <!-- Scrollable content -->
      <main
        :class="
          isAuthPage
            ? 'h-screen flex items-center justify-center overflow-hidden px-0 mt-0'
            : 'flex-1 overflow-y-auto mt-24 px-4'
        "
      >
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

const isAuthPage = computed(() => {
  const authRoutes = ['login', 'register', 'forgot-password', 'reset-password']
  return authRoutes.includes(route.name as string)
})

const shouldShowMenuBar = computed(() => {
  const hiddenRoutes = ['login', 'register', 'not-found', 'forgot-password', 'reset-password']
  return !hiddenRoutes.includes(route.name as string)
})
</script>

<style scoped>
/* Background base */
.app-bg {
  position: fixed;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  z-index: 1;
}

/* 🔐 LOGIN / AUTH */
.auth-bg {
  background-image: url('@/assets/images/homeBG2.png');
  filter: brightness(1.2) contrast(1.1) saturate(1.15);
}

/* 🏠 APP PAGES BACKGROUND — darker, softer, cleaner */
.main-bg {
  background-image: url('@/assets/images/homeBG2.png');
  opacity: 0.85; /* Softer */
  filter: brightness(0.45) contrast(1.2) saturate(1.05) blur(0.6px); /* Smooth UI-friendly */
}

/* 🖤 Both overlays */
.app-overlay {
  position: fixed;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

/* Darker overlay for auth (to emphasize form) */
.auth-bg + .app-overlay {
  background:
    radial-gradient(circle at 50% 35%, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.75)),
    rgba(0, 0, 0, 0.45);
}

/* Softer overlay for app pages */
.main-bg + .app-overlay {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.65));
  backdrop-filter: blur(2px);
}
</style>

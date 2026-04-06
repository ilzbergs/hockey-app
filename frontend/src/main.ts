import '@/assets/tailwind.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'
import Aura from '@primevue/themes/aura'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { useAuthStore } from './stores/authStore'

ModuleRegistry.registerModules([AllCommunityModule])

async function bootstrap() {
  const app = createApp(App)
  const pinia = createPinia()
  app.use(pinia)

  // ⬇️ 1. Inicializē session pirms router mount
  const authStore = useAuthStore()
  await authStore.initAuth() // fetchUserData izsauksies un atjaunos isAuthenticated

  // ⬇️ 2. Tikai pēc tam mount router
  app.use(router)

  app.use(PrimeVue, {
    theme: { preset: Aura, options: { darkModeSelector: 'dark' } },
    ripple: true,
  })
  app.use(ToastService)
  app.component('Toast', Toast)

  app.mount('#app')
}

bootstrap()

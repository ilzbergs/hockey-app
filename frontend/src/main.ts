import '@/assets/tailwind.css'
import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Aura from '@primevue/themes/aura'
import router from './router'
import { createPinia } from 'pinia'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'

const pinia = createPinia()
const app = createApp(App)

ModuleRegistry.registerModules([AllCommunityModule])

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
  ripple: true,
})

app.use(ToastService)
app.use(router)
app.use(pinia)

app.mount('#app')

<template>
  <div class="min-h-screen ">
    <!-- Navigation is fixed at the top -->
    <Navigation v-if="shouldShowMenuBar" class="" />
    <!-- Scrollable content -->
    <div class="relative flex-grow overflow-y-auto">
      <router-view />
    </div>
        <div v-if=" predictionStore.errorMessage " class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white py-2 px-4 rounded">
      {{  predictionStore.errorMessage  }}
      <button @click="reloadPage" class="ml-2 text-sm underline">Pārlādēt lapu</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import Navigation from './components/PageNavigation.vue'
import { usePredictionsStore } from './stores/predictionStore';

const route = useRoute()
// State for error message

const predictionStore = usePredictionsStore()

// Function to reload the page
function reloadPage() {
  window.location.reload()

}
// Define a computed property to determine if MenuBar should be shown
const shouldShowMenuBar = computed(() => {
  // MenuBar is hidden for specific routes
  const hiddenRoutes = ['login', 'register', 'not-found']
  return !hiddenRoutes.includes(route.name as string)
})
</script>

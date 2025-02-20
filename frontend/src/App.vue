<template>
  <!-- Conditionally render MenuBar based on route -->
  <Navigation v-if="shouldShowMenuBar" />
 <div >
   <router-view />
  </div>

</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import Navigation from './components/PageNavigation.vue'

const route = useRoute()

// Define a computed property to determine if MenuBar should be shown
const shouldShowMenuBar = computed(() => {
  // MenuBar is hidden for specific routes
  const hiddenRoutes = ['login', 'register', 'not-found']
  return !hiddenRoutes.includes(route.name as string)
})
</script>

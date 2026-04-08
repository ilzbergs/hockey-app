<template>
  <div
    @click="navigate"
    class="cursor-pointer text-gray-200 hover:text-white transition font-medium relative pb-1"
    :class="{ '!text-blue-400': active }"
  >
    <slot>{{ label }}</slot>

    <span
      v-if="active"
      class="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-400 rounded-full"
    ></span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  label: String,
  path: String,
})

const route = useRoute()
const router = useRouter()

const active = computed(() => route.path === props.path)

/**
 * Navigate to the specified path when the nav item is clicked.
 * If the path is not specified, navigate to the root path.
 */
function navigate(){
  // If the path is not specified, navigate to the root path
  const path = props.path || '/'

  // Navigate to the specified path
  router.push(path)
}
</script>

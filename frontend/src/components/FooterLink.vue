<template>
  <router-link
    :to="to"
    class="block text-gray-400 hover:text-white text-sm transition"
  >
    <slot></slot>
  </router-link>
</template>

<script setup lang="ts">
defineProps({
  to: { type: String, required: true },
})
</script>

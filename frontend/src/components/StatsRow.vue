<template>
  <div class="flex justify-between items-center py-2 border-b border-white/10">
    <span class="text-gray-300">{{ label }}</span>
    <span class="text-white font-semibold">{{ value }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps({
  label: String,
  value: [String, Number],
})
</script>

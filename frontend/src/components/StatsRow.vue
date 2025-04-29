<template>
  <div class="flex justify-between text-sm">
    <span class="text-gray-600">{{ label }}:</span>
    <span class="font-semibold">{{ value }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
})
</script>

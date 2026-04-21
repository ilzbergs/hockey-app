<template>
  <div class="flex justify-center w-full">
    <FormField v-slot="{ invalid, error }" initialValue="" as="section" :name="name">
      <InputText
        class="dark-input cursor-text"
        :modelValue="modelValue"
        :type="type"
        :placeholder="placeholder"
        size="small"
        fluid
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement)?.value)"
        
      />
      <Message v-if="invalid" severity="error" size="small" variant="simple">{{
        error?.message
      }}</Message>
    </FormField>
  </div>
</template>

<script setup lang="ts">
import { FormField } from '@primevue/forms'
import { InputText, Message } from 'primevue'

defineProps({
  modelValue: String,
  name: String,
  type: String,
  placeholder: String,
})
</script>

<style scoped>
.dark-input:hover {
  @apply bg-white/60;
}
</style>

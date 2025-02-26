<template>
  <div class="flex justify-center">
    <FormField v-slot="{ invalid, error }" initialValue="" as="section" :name="name">
      <InputText
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
  modelValue: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    required: true,
  },
})
</script>

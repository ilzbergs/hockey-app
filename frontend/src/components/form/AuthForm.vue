<template>
  <div class="relative flex items-center justify-center h-screen">
    <div
      class="absolute inset-0 bg-[url('/src/assets/images/bg.png')] bg-cover bg-center opacity-80"
    ></div>
    <div
      class="bg-white/30 backdrop-blur-md border border-white/20 shadow-lg flex flex-col gap-4 p-10 rounded-lg"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col">
          <h1 class="text-2xl font-bold">{{ title }}</h1>
          <div class="text-sm">
            <span> vai </span>
            <RouterLink :to="to" class="text-blue-500 hover:text-blue-700">{{
              subtitle
            }}</RouterLink>
          </div>
        </div>
        <Form :resolver="resolver" @submit="submitForm" v-slot="$form">
          <div class="flex flex-col gap-4">
            <slot name="formFields"></slot>
            <Button
              class="w-full"
              type="submit"
              :icon="submitIcon"
              :label="submitLabel"
              severity="secondary"
              :disabled="
                !$form.valid ||
                Object.values($form).some(
                  (field) => typeof field === 'object' && 'value' in field && field.value === '',
                )
              "
            />
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Form } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { Button } from 'primevue'
import { ref } from 'vue'
import { z } from 'zod'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  validationSchema: {
    type: Object,
    required: true,
  },
  submitLabel: {
    type: String,
    required: true,
  },
  submitIcon: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
})

const resolver = zodResolver(z.object(props.validationSchema))
const emit = defineEmits(['submit'])

const formValues = ref({})

const submitForm = () => {
  emit('submit', formValues.value)
}
</script>

<template>
  <AuthForm
    v-model="formValues"
    title="Aizmirsu paroli"
    subtitle="Ievadi e-pastu, lai saņemtu reset link"
    :validationSchema="forgotPasswordValidationSchema"
    submitLabel="Sūtīt e-pastu"
    submitIcon="pi pi-envelope"
    to="/"
    @submit="submit"
  >
    <template #formFields>
      <FormField
        v-model="formValues.email"
        name="email"
        type="text"
        placeholder="E-pasts"
      />
    </template>
  </AuthForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AuthForm from '../../components/form/AuthForm.vue'
import FormField from '../../components/form/FormField.vue'
import { z } from 'zod'
import { useAuthStore } from '../../stores/authStore'

const authStore = useAuthStore()
const formValues = ref({ email: '' })

const forgotPasswordValidationSchema = {
  email: z.string().email({ message: 'Nepareizs e-pasts' }),
}

async function submit() {
  await authStore.requestPasswordReset(formValues.value.email)
}
</script>

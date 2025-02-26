<template>
  <AuthForm
    v-model="formValues"
    title="Pieteikties"
    subtitle="izveidot jaunu lietotāju"
    :validationSchema="userLoginValidationSchema"
    submitLabel="Pieteikties"
    submitIcon="pi pi-sign-in"
    to="/register"
    @submit="login(formValues.email, formValues.password)"
  >
    <template #formFields>
      <FormField v-model="formValues.email" name="email" type="text" placeholder="E-pasts">
      </FormField>
      <FormField v-model="formValues.password" name="password" type="password" placeholder="Parole">
      </FormField>
    </template>
  </AuthForm>
</template>

<script setup lang="ts">
import FormField from '../../components/form/FormField.vue'
import AuthForm from '../../components/form/AuthForm.vue'
import { z } from 'zod'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const router = useRouter()
const formValues = ref({ email: '', password: '' })

const authStore = useAuthStore()

const userLoginValidationSchema = {
  email: z
    .string()
    .email({ message: 'Nepareizs e-pasts' })
    .min(1, { message: 'E-pasts ir obligāts' }),
  password: z.string().min(1, { message: 'Parole ir obligāta' }),
}

async function login(email: string, password: string) {
  try {
    await authStore.login(email, password)
    router.push('/home')
  } catch (error) {
    console.error('Login failed:', error)
    alert('Login failed. Please try again.')
  }
}
</script>

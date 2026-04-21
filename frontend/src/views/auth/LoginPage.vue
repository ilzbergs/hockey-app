<template>
  <AuthForm
    v-model="formValues"
    title="Pieteikties"
    subtitle="izveidot jaunu lietotāju"
    :validationSchema="userLoginValidationSchema"
    submitLabel="Pieteikties!"
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

    <template #extra>
      <RouterLink to="/forgot-password" class="text-blue-500 hover:text-blue-700 text-sm mt-2">
        Aizmirsu paroli?
      </RouterLink>
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
// import { useNotificationStore } from '../../stores/notificationStore'

const router = useRouter()
const formValues = ref({ email: '', password: '' })
// const notificationStore = useNotificationStore()

const authStore = useAuthStore()

const userLoginValidationSchema = {
  email: z
    .string()
    .email({ message: 'Nepareizs e-pasts' })
    .min(1, { message: 'E-pasts ir obligāts' }),
  password: z.string().min(1, { message: 'Parole ir obligāta' }),
}

async function login(email: string, password: string) {
  await authStore.login(email, password)
  router.push('/home')
}

// async function forgotPassword() {
//   if (!formValues.value.email) {
//     notificationStore.setErrorNotification('Ievadi savu e-pastu')
//     return
//   }

//   try {
//     await authStore.requestPasswordReset(formValues.value.email)
//     notificationStore.setSuccessNotification(
//       'Paroles atjaunošanas saite nosūtīta (lokāli check logs)',
//     )
//     router.push({ name: 'forgot-password', query: { email: formValues.value.email } })
//   } catch (err: any) {
//     notificationStore.setErrorNotification(err.message || 'Neizdevās nosūtīt reset saiti')
//   }
// }
</script>

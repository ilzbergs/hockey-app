<template>
  <AuthForm
    v-model="formValues"
    title="Izveidot jaunu lietotāju"
    subtitle="pieteikties ar esošu lietotāju"
    :validationSchema="userSignUpValidationSchema"
    submitLabel="Reģistrēties"
    submitIcon="pi pi-user-plus"
    to="/login"
    @submit="createUser()"
  >
    <template #formFields>
      <FormField
        v-model="formValues.username"
        name="username"
        type="text"
        placeholder="Lietotājvārds"
      >
      </FormField>
      <FormField v-model="formValues.firstName" name="firstName" type="text" placeholder="Vārds">
      </FormField>
      <FormField v-model="formValues.lastName" name="lastName" type="text" placeholder="Uzvārds">
      </FormField>
      <FormField v-model="formValues.email" name="email" type="text" placeholder="E-pasts">
      </FormField>
      <FormField v-model="formValues.password" name="password" type="password" placeholder="Parole">
      </FormField>
      <FormField
        v-model="formValues.passwordConfirm"
        name="passwordConfirm"
        type="password"
        placeholder="Apstiprināt paroli"
      >
      </FormField>
    </template>
  </AuthForm>
</template>

<script setup lang="ts">
import AuthForm from '../../components/form/AuthForm.vue'
import FormField from '../../components/form/FormField.vue'
import { ref } from 'vue'
import { z } from 'zod'
import { useUserStore } from '../../stores/userStore'

const userStore = useUserStore()

interface FormValues {
  username: string
  firstName: string
  lastName: string
  email: string
  password: string
  passwordConfirm: string
  role: string
}

const formValues = ref<FormValues>({
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  passwordConfirm: '',
  role: 'user',
})

const userSignUpValidationSchema = {
  username: z.string().min(1, { message: 'Lietotājvārds ir obligāts.' }),
  firstName: z.string().min(1, { message: 'Vārds ir obligāts.' }),
  lastName: z.string().min(1, { message: 'Uzvārds ir obligāts.' }),
  email: z
    .string()
    .min(1, { message: 'E-pasts ir obligāts.' })
    .email({ message: 'Nepareizs e-pasta formāts.' }),
  password: z.string().min(8, { message: 'Jābūt vismaz 8 simboliem.' }),
  passwordConfirm: z
    .string()
    .min(8, { message: 'Parolēm ir jāsakrīt' })
    .refine((value) => value === formValues.value.password, {
      message: 'Paroles nesakrīt.',
    }),
}

/**
 * Attempts to create a new user with the provided registration data.
 *
 * @throws {Error} If the request fails or there is an error creating the user.
 */
async function createUser() {
  try {
    await userStore.signupUser(formValues.value)
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}
</script>

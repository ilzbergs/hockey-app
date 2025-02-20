<template>
  <div class="flex items-center justify-center h-screen">
    <div class="bg-red-300 flex flex-col gap-4 p-4 rounded-lg">
      <div>
        <h3 class="text-2xl">Izveidot jaunu lietotāju</h3>
        <p>
          vai
          <router-link to="/login" class="text-blue-500 hover:text-blue-700"
            >pieteikties ar esošu lietotāju</router-link
          >
        </p>
      </div>
      <div class="flex justify-center">
        <Form
          v-slot="$form"
          :resolver="resolver"
          :initialValues="initialValues"
          @submit="createUser"
          class="flex flex-col gap-4 w-56"
        >
          <div class="flex flex-col gap-1">
            <InputText
              v-model="initialValues.username"
              name="username"
              type="text"
              placeholder="Lietotājvārds"
              fluid
              size="small"
            />
            <Message
              v-if="$form.username?.invalid"
              severity="error"
              size="small"
              variant="simple"
              >{{ $form.username.error?.message }}</Message
            >
          </div>
          <div class="flex flex-col gap-1">
            <InputText
              v-model:modelValue="initialValues.firstName"
              name="firstName"
              type="text"
              placeholder="Vārds"
              fluid
              size="small"
            />
            <Message
              v-if="$form.firstName?.invalid"
              severity="error"
              size="small"
              variant="simple"
              >{{ $form.firstName.error?.message }}</Message
            >
          </div>
          <div class="flex flex-col gap-1">
            <InputText
              v-model:modelValue="initialValues.lastName"
              name="lastName"
              type="text"
              placeholder="Uzvārds"
              fluid
              size="small"
            />
            <Message
              v-if="$form.lastName?.invalid"
              severity="error"
              size="small"
              variant="simple"
              >{{ $form.lastName.error?.message }}</Message
            >
          </div>
          <div class="flex flex-col gap-1">
            <InputText
              v-model:modelValue="initialValues.email"
              name="email"
              type="text"
              placeholder="E-pasts"
              fluid
              size="small"
            />
            <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{
              $form.email.error?.message
            }}</Message>
          </div>
          <div class="flex flex-col gap-1">
            <InputText
              v-model:modelValue="initialValues.password"
              name="password"
              type="password"
              placeholder="Parole"
              fluid
              size="small"
            />
            <Message
              v-if="$form.password?.invalid"
              severity="error"
              size="small"
              variant="simple"
              >{{ $form.password.error?.message }}</Message
            >
          </div>
          <div class="flex flex-col gap-1">
            <InputText
              v-model:modelValue="initialValues.passwordConfirm"
              name="passwordConfirm"
              type="password"
              placeholder="Apstiprināt paroli"
              fluid
              size="small"
            />
            <Message
              v-if="$form.passwordConfirm?.invalid"
              severity="error"
              size="small"
              variant="simple"
              >{{ $form.passwordConfirm.error?.message }}</Message
            >
          </div>

          <Button
            type="submit"
            icon="pi pi-user-plus"
            severity="secondary"
            label="Izveidot lietotāju"
          />
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { InputText, Message, Button } from 'primevue'
import { Form } from '@primevue/forms'
import { useUserStore } from '../../stores/userStore'

const userStore = useUserStore()

const initialValues = ref({
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  passwordConfirm: '',
  role: 'user',
})

const resolver = ref(
  zodResolver(
    z
      .object({
        username: z.string().min(1, { message: 'Username is required.' }),
        firstName: z.string().min(1, { message: 'First name is required.' }),
        lastName: z.string().min(1, { message: 'Last name is required.' }),
        email: z
          .string()
          .min(1, { message: 'Email is required.' })
          .email({ message: 'Invalid email address.' }),
        password: z
          .string()
          .min(8, { message: 'Password is required and must be at least 8 characters.' }),
        passwordConfirm: z.string().min(8, { message: 'Password confirmation is required.' }),
      })
      .refine((val) => val.password === val.passwordConfirm, {
        path: ['passwordConfirm'],
        message: 'Passwords do not match.',
      }),
  ),
)

/**
 * Attempts to create a new user with the provided registration data.
 *
 * @throws {Error} If the request fails or there is an error creating the user.
 */
async function createUser() {
  try {
    await userStore.createUser(initialValues.value)
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}
</script>

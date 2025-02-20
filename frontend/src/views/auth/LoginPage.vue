<template>
  <div
    class="flex items-center justify-center h-screen"
  >

    <div class="bg-red-300 flex flex-col gap-4 p-4 rounded-lg">
      <div>
        <h3 class="text-2xl">Pieteikties</h3>
        <p>
          vai
          <router-link to="/register" class="text-blue-500 hover:text-blue-700"
            >izveidot jaunu lietotāju</router-link
          >
        </p>
      </div>
      <div class="flex justify-center">
        <Form :resolver @submit="login(email, password)" class="flex flex-col gap-4 w-56">
          <FormField
            v-slot="$field"
            as="section"
            name="email"
            initialValue=""
            class="flex flex-col gap-2"
          >
            <InputText v-model="email" type="email" placeholder="E-pasts" size="small" fluid />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
              $field.error?.message
            }}</Message>
          </FormField>
          <FormField
            v-slot="$field"
            asChild
            name="password"
            initialValue=""
            class="flex flex-col gap-2"
          >
            <Password
              v-model="password"
              type="text"
              placeholder="Parole"
              :feedback="false"
              toggleMask
              fluid
              size="small"
            />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
              $field.error?.message
            }}</Message>
          </FormField>
          <Button type="submit" icon="pi pi-sign-in" severity="secondary" label="Pieteikties" :disabled="!formValid" />
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { InputText, Password, Message, Button} from 'primevue'
import { Form, FormField } from '@primevue/forms'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const router = useRouter()
const email = ref('')
const password = ref('')
const authStore = useAuthStore()
const formValid = computed(() => {
  return email.value && password.value
})

const resolver = zodResolver(
  z.object({
    email: z
      .string()
      .min(1, { message: 'Email is required.' })
      .email({ message: 'Invalid email address.' }),
    password: z.string().min(1, { message: 'Password is required.' }),
  }),
)

/**
 * Attempts to log in a user with the provided email and password.
 * If the login is successful, the user is redirected to the home page.
 * If the login fails, an alert is displayed indicating the failure.
 *
 * @param email - The email of the user attempting to log in.
 * @param password - The password of the user attempting to log in.
 */

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

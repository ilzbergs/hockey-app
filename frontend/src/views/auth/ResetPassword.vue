<template>
  <AuthForm
    v-model="formValues"
    title="Atjaunot paroli"
    subtitle="Ievadi jauno paroli"
    :validationSchema="resetPasswordValidationSchema"
    submitLabel="Mainīt paroli"
    submitIcon="pi pi-key"
    to="/"
    @submit="submit"
  >
    <template #formFields>
      <FormField
        v-model="formValues.password"
        name="password"
        type="password"
        placeholder="Jaunā parole"
      />
      <FormField
        v-model="formValues.passwordConfirm"
        name="passwordConfirm"
        type="password"
        placeholder="Apstiprini paroli"
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
import { useRoute } from 'vue-router'

const authStore = useAuthStore()
const route = useRoute()

const token = route.query.token as string || '' // Pieņem token kā query param
const formValues = ref({ password: '', passwordConfirm: '' })

const resetPasswordValidationSchema = {
  password: z.string().min(6, { message: 'Parolei jābūt vismaz 6 simbolu garai' }),
  passwordConfirm: z.string().min(6).refine((val) => val === formValues.value.password, { message: 'Paroles nesakrīt' }),
}

async function submit() {
  if (!token) {
    alert('Token nav derīgs vai nav pieejams')
    return
  }
  await authStore.resetPassword(token, formValues.value.password, formValues.value.passwordConfirm)
}
</script>

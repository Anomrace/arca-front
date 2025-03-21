<template>
  <q-page class="flex flex-center">
    <q-card class="auth bg-primary text-white q-pa-lg">
      <q-card-section>
        <ToolbarTitle />
      </q-card-section>

      <q-card-section>
        <q-tabs v-model="tab" no-caps>
          <q-tab name="login" label="Se connecter" />
          <q-tab name="register" label="S'enregistrer" />
        </q-tabs>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="submitForm">
          <!-- Email -->
          <q-input
            v-model="credentials.email"
            class="q-mb-md"
            filled
            bg-color="white"
            label="Email"
            type="email"
            autocomplete="email"
          />

          <!-- Mot de passe -->
          <q-input
            v-model="credentials.password"
            class="q-mb-md"
            filled
            bg-color="white"
            label="Mot de passe"
            type="password"
            autocomplete="current-password"
          />

          <!-- Prénom / Nom (si enregistrement) -->
          <q-input
            v-if="tab === 'register'"
            v-model="credentials.firstName"
            class="q-mb-md"
            filled
            bg-color="white"
            label="Prénom"
          />
          <q-input
            v-if="tab === 'register'"
            v-model="credentials.lastName"
            class="q-mb-md"
            filled
            bg-color="white"
            label="Nom"
          />

          <q-btn
            type="submit"
            class="full-width"
            no-caps
            outline
            color="white"
            :label="submitButtonTitle"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

import { Dialog } from 'quasar'
import ToolbarTitle from 'src/components/ToolbarTitle.vue'
import useAuth from 'src/composables/useAuth'

const tab = ref('login')
const { login, register } = useAuth()
const submitButtonTitle = computed(() => {
  return tab.value === 'login' ? 'Se connecter' : "S'enregistrer"
})

const credentials = reactive({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
})

const submitForm = async () => {
  if (!credentials.email || !credentials.password) {
    return Dialog.create({
      type: 'negative',
      title: 'Erreur',
      message: 'Email et mot de passe requis',
    })
  }

  if (tab.value === 'register') {
    if (!credentials.firstName || !credentials.lastName) {
      return Dialog.create({
        type: 'negative',
        title: 'Erreur',
        message: 'Prénom et nom requis pour vous enregistrer',
      })
    }

    await register({
      email: credentials.email,
      password: credentials.password,
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      role: 'student',
    })
  } else {
    await login({
      email: credentials.email,
      password: credentials.password,
    })
  }
}
</script>

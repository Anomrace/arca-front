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

          <!-- Prénom / Nom (si inscription) -->
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
import { useRouter } from 'vue-router'
import { Dialog } from 'quasar'

import ToolbarTitle from 'src/components/ToolbarTitle.vue'
import { useAuthStore } from 'src/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const tab = ref('login')

const submitButtonTitle = computed(() => (tab.value === 'login' ? 'Se connecter' : "S'enregistrer"))

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

  try {
    let success = false

    if (tab.value === 'register') {
      if (!credentials.firstName || !credentials.lastName) {
        return Dialog.create({
          type: 'negative',
          title: 'Erreur',
          message: 'Prénom et nom requis pour vous enregistrer',
        })
      }

      success = await auth.register({
        email: credentials.email,
        password: credentials.password,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        role: 'student', // valeur par défaut ici
      })
    } else {
      success = await auth.login({
        email: credentials.email,
        password: credentials.password,
      })
    }

    if (success) {
      Dialog.create({
        type: 'positive',
        title: 'Succès',
        message: 'Connexion réussie',
      })

      // 🔥 Redirection par rôle (à lire dans user_metadata)
      const role = auth.user?.user_metadata?.role || 'student'

      const redirectByRole = {
        admin: '/dashboard-admin',
        student: '/dashboard-student',
        professor: '/dashboard-professor',
        parent: '/dashboard-parent',
      }

      router.push(redirectByRole[role] || '/')
    } else {
      throw new Error('Échec de connexion ou utilisateur introuvable')
    }
  } catch (err) {
    Dialog.create({
      type: 'negative',
      title: 'Erreur',
      message: err?.message || 'Erreur de connexion',
    })
  }
}
</script>

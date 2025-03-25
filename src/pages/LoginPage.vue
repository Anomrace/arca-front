<template>
  <q-page class="flex flex-center">
    <q-card class="auth bg-primary text-white q-pa-lg" style="min-width: 360px">
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
          <q-input
            v-model="credentials.email"
            class="q-mb-md"
            filled
            bg-color="white"
            label="Email"
            type="email"
            autocomplete="email"
          />
          <q-input
            v-model="credentials.password"
            class="q-mb-md"
            filled
            bg-color="white"
            label="Mot de passe"
            type="password"
            autocomplete="current-password"
          />

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
            :loading="isSubmitting"
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Dialog } from 'quasar'
import ToolbarTitle from 'src/components/ToolbarTitle.vue'
import { useAuthStore } from 'src/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const tab = ref('login')
const isSubmitting = ref(false)

const submitButtonTitle = computed(() => (tab.value === 'login' ? 'Se connecter' : "S'enregistrer"))

const credentials = reactive({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
})

const submitForm = async () => {
  if (isSubmitting.value) return
  isSubmitting.value = true

  try {
    if (!credentials.email || !credentials.password) {
      throw new Error('Email et mot de passe requis')
    }

    if (tab.value === 'register') {
      if (!credentials.firstName || !credentials.lastName) {
        throw new Error('Prénom et nom requis pour vous enregistrer')
      }

      await auth.register({
        email: credentials.email,
        password: credentials.password,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        role: 'admin',
      })

      Dialog.create({
        type: 'info',
        title: 'Inscription réussie',
        message: 'Un email de confirmation a été envoyé. Veuillez vérifier votre boîte mail.',
      })
      return
    }

    // ✅ Connexion
    const success = await auth.login({
      email: credentials.email,
      password: credentials.password,
    })

    if (!success || !auth.user) {
      throw new Error('Échec de connexion ou utilisateur introuvable')
    }

    const role = auth.user.user_metadata?.role || 'student'

    const redirectByRole = {
      admin: '/dashboard-admin',
      student: '/dashboard-student',
      professor: '/dashboard-professor',
      parent: '/dashboard-parent',
    }

    Dialog.create({
      type: 'positive',
      title: 'Connexion réussie',
      message: `Bienvenue, redirection vers votre tableau de bord (${role})`,
    })

    const path = redirectByRole[role] || '/'
    router.push(path)
  } catch (err) {
    Dialog.create({
      type: 'negative',
      title: 'Erreur',
      message: err.message || 'Erreur de connexion',
    })
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  if (route.query.confirmed === 'true') {
    await auth.fetchUser()

    Dialog.create({
      type: 'positive',
      title: 'Email confirmé',
      message:
        'Votre adresse email a été vérifiée avec succès. Vous pouvez maintenant vous connecter.',
    })
  }
})
</script>

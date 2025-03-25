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
            filled
            bg-color="white"
            label="Email"
            type="email"
            class="q-mb-md"
          />
          <q-input
            v-model="credentials.password"
            filled
            bg-color="white"
            label="Mot de passe"
            type="password"
            class="q-mb-md"
          />

          <q-input
            v-if="tab === 'register'"
            v-model="credentials.firstName"
            filled
            bg-color="white"
            label="Prénom"
            class="q-mb-md"
          />
          <q-input
            v-if="tab === 'register'"
            v-model="credentials.lastName"
            filled
            bg-color="white"
            label="Nom"
            class="q-mb-md"
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
import { useAuthStore } from 'src/stores/auth'
import ToolbarTitle from 'src/components/ToolbarTitle.vue'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const tab = ref('login')
const isSubmitting = ref(false)

const credentials = reactive({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
})

const submitButtonTitle = computed(() => (tab.value === 'login' ? 'Se connecter' : "S'enregistrer"))

const redirectByRole = {
  admin: '/dashboard-admin',
  student: '/dashboard-student',
  professor: '/dashboard-professor',
  parent: '/dashboard-parent',
}

const submitForm = async () => {
  if (isSubmitting.value) return
  isSubmitting.value = true

  try {
    const { email, password, firstName, lastName } = credentials

    if (!email || !password) throw new Error('Email et mot de passe requis')

    if (tab.value === 'register') {
      if (!firstName || !lastName) throw new Error('Prénom et nom requis')

      await auth.register({
        email,
        password,
        firstName,
        lastName,
        role: 'admin',
      })

      Dialog.create({
        type: 'info',
        title: 'Inscription réussie',
        message: 'Un email de confirmation vous a été envoyé.',
      })

      return
    }

    const success = await auth.login({ email, password })
    if (!success) throw new Error('Échec de connexion')

    await auth.fetchUser()

    const role = auth.user?.user_metadata?.role || 'student'
    const path = redirectByRole[role] || '/'

    Dialog.create({
      type: 'positive',
      title: 'Connexion réussie',
      message: `Bienvenue ${auth.user?.user_metadata?.firstName || ''} !`,
    })

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
      message: 'Votre adresse email a été vérifiée. Vous pouvez vous connecter.',
    })
  }
})
</script>

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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog } from 'quasar'
import { useRoute } from 'vue-router'
import ToolbarTitle from 'src/components/ToolbarTitle.vue'
import { useAuthStore } from 'src/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const route = useRoute()
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
    if (tab.value === 'register') {
      if (!credentials.firstName || !credentials.lastName) {
        return Dialog.create({
          type: 'negative',
          title: 'Erreur',
          message: 'Prénom et nom requis pour vous enregistrer',
        })
      }

      // ✅ Inscription : ne pas tenter de rediriger, l'utilisateur n’est pas encore connecté
      await auth.register({
        email: credentials.email,
        password: credentials.password,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        role: 'admin',
      })

      return Dialog.create({
        type: 'info',
        title: 'Confirmation requise',
        message:
          'Un email de confirmation a été envoyé. Veuillez vérifier votre boîte de réception.',
      })
    }

    // ✅ Connexion
    const success = await auth.login({
      email: credentials.email,
      password: credentials.password,
    })

    if (!success) {
      throw new Error('Échec de connexion')
    }

    await auth.fetchUser()

    if (!auth.user) {
      throw new Error('Utilisateur introuvable après connexion')
    }

    const role = auth.user?.user_metadata?.role || 'student'

    const redirectByRole = {
      admin: '/dashboard-admin',
      student: '/dashboard-student',
      professor: '/dashboard-professor',
      parent: '/dashboard-parent',
    }

    const path = redirectByRole[role] || '/'
    console.log('🔁 redirection vers', path)

    Dialog.create({
      type: 'positive',
      title: 'Succès',
      message: 'Connexion réussie',
    })

    router.push(path)
  } catch (err) {
    Dialog.create({
      type: 'negative',
      title: 'Erreur',
      message: err?.message || 'Erreur de connexion',
    })
  }
}

onMounted(
  async () => {
    if (route.query.confirmed === 'true') {
      await auth.fetchUser()

      Dialog.create({
        type: 'positive',
        title: 'Email confirmé',
        message:
          'Votre adresse email a été vérifiée avec succès. Vous pouvez maintenant vous connecter.',
      })
    }
  },

  () => {
    if (route.query.confirmed === 'true') {
      Dialog.create({
        type: 'positive',
        title: 'Email confirmé',
        message:
          'Votre adresse email a été vérifiée avec succès. Vous pouvez maintenant vous connecter.',
      })
    }
  },
)
</script>

<template>
  <q-page class="flex flex-center q-pa-md">
    <q-card style="width: 400px; max-width: 90vw">
      <q-card-section>
        <div class="text-h6 text-center">
          {{ isLogin ? 'Connexion' : 'Créer un compte' }}
        </div>
      </q-card-section>

      <q-card-section class="q-gutter-md">
        <q-input v-model="email" label="Email" type="email" outlined dense />
        <q-input v-model="password" label="Mot de passe" type="password" outlined dense />
        <q-input
          v-if="!isLogin"
          v-model="confirmPassword"
          label="Confirmer le mot de passe"
          type="password"
          outlined
          dense
        />
      </q-card-section>

      <q-card-actions class="q-px-md q-pt-sm">
        <q-btn
          :label="isLogin ? 'Se connecter' : 'Créer le compte'"
          color="primary"
          class="full-width"
          :loading="loading"
          @click="handleSubmit"
        />
      </q-card-actions>

      <q-card-section class="text-center q-py-sm">
        <q-btn
          flat
          size="sm"
          color="primary"
          @click="isLogin = !isLogin"
          :label="isLogin ? 'Créer un compte' : 'Déjà inscrit ? Se connecter'"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { supabase } from 'boot/supabase'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const isLogin = ref(true)

const $q = useQuasar()
const router = useRouter()

async function handleSubmit() {
  if (!email.value || !password.value) {
    $q.notify({ type: 'warning', message: 'Veuillez remplir tous les champs.' })
    return
  }

  if (!isLogin.value && password.value !== confirmPassword.value) {
    $q.notify({ type: 'warning', message: 'Les mots de passe ne correspondent pas.' })
    return
  }

  loading.value = true

  try {
    if (isLogin.value) {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })

      if (error) throw error

      $q.notify({ type: 'positive', message: 'Connexion réussie ✅' })
      router.push('/')
    } else {
      const { error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      })

      if (error) throw error

      $q.notify({
        type: 'positive',
        message: 'Compte créé ! Vérifiez vos emails pour confirmer l’adresse.',
      })

      // Optionnel : revenir à la connexion
      isLogin.value = true
    }
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: err.message || 'Une erreur est survenue.',
      icon: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>

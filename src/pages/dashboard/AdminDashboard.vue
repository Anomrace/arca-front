<template>
  <q-page class="q-pa-md">
    <q-spinner color="primary" v-if="auth.isLoading" />

    <div v-else>
      <p>Bienvenue {{ auth.user?.user_metadata?.firstName }} 🎉</p>

      <q-banner v-if="auth.isAdmin()" dense class="bg-primary text-white q-mt-md">
        Vous êtes connecté en tant qu'admin.
      </q-banner>

      <q-banner v-else dense class="bg-warning text-dark q-mt-md">
        Ce tableau de bord est réservé aux administrateurs.
      </q-banner>
    </div>
  </q-page>
</template>

<script setup>
import { useAuthStore } from 'src/stores/auth'
import { onMounted } from 'vue'

const auth = useAuthStore()

onMounted(() => {
  if (!auth.user) {
    auth.fetchUser()
  }
})
</script>

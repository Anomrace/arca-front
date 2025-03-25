<template>
  <q-page class="q-pa-md">
    <q-spinner v-if="auth.isLoading" color="primary" />
    <div v-else>
      <p>👋 Bienvenue {{ auth.user?.user_metadata?.firstName }}</p>
      <pre>{{ auth.user }}</pre>
    </div>
  </q-page>
</template>

<script setup>
import { useAuthStore } from 'src/stores/auth'
const auth = useAuthStore()
</script>

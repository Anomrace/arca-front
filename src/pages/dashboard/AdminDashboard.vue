<template>
  <q-page class="q-pa-md">
    <p>Bienvenue {{ user?.firstName }}</p>
  </q-page>
</template>

<script setup>
import { useAuthStore } from 'src/stores/auth'
const { user } = useAuthStore()
</script>

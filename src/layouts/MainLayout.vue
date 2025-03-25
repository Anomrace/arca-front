<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          🔐 Bonjour {{ auth.user?.user_metadata?.firstName || '...' }} ({{
            auth.user?.user_metadata?.role || '?'
          }})
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useAuthStore } from 'src/stores/auth'
const auth = useAuthStore()
console.log('💥 auth:', auth.user)
</script>

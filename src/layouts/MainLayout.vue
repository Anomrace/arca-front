<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Espace Membre</q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      <q-list>
        <q-item-label header> Menu </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
      <q-btn flat icon="logout" @click="logout" />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import EssentialLink from 'components/EssentialLink.vue'
import { supabase } from 'boot/supabase'

const linksList = [
  { title: 'Dashboard', icon: 'dashboard', to: '/' },
  { title: 'Élèves', icon: 'group', to: '/eleves' },
  { title: 'Professeurs', icon: 'school', to: '/professeurs' },
  { title: 'Calendrier', icon: 'event', to: '/calendrier' },
  { title: 'Ressources', icon: 'folder', to: '/ressources' },
  { title: 'Finances', icon: 'bar_chart', to: '/finances' },
  { title: 'Factures', icon: 'receipt', to: '/factures' },
  { title: 'Paramètres', icon: 'settings', to: '/parametres' },
]
const rightDrawerOpen = ref(false)

const router = useRouter()
function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value
}
async function logout() {
  await supabase.auth.signOut()
  router.push('/login')
}
</script>

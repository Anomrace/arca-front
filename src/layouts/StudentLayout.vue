<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <ToolbarTitle />
        <q-toolbar-title>
          Bonjour {{ auth.user?.firstName || 'Élève' }} ({{ auth.user?.role }})
        </q-toolbar-title>
        <q-btn flat round icon="menu" @click="drawer = !drawer" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" side="right" bordered>
      <q-list>
        <q-item-label header class="q-pa-md">Menu</q-item-label>
        <q-item v-for="link in links" :key="link.title" clickable @click="goTo(link)">
          <q-item-section avatar><q-icon :name="link.icon" /></q-item-section>
          <q-item-section>{{ link.title }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ToolbarTitle from 'src/components/ToolbarTitle.vue'
import { useAuthStore } from 'src/stores/auth'

const drawer = ref(false)
const router = useRouter()
const auth = useAuthStore()

const links = [
  { title: 'Calendrier', icon: 'event', link: '/calendar' },
  { title: 'Ressources', icon: 'language', link: '/resources' },
  { title: 'Paramètres', icon: 'settings', link: '/settings' },
  { title: 'Déconnexion', icon: 'logout', action: 'logout' },
]

function goTo(link) {
  if (link.action === 'logout') {
    auth.logout()
    router.push('/auth')
  } else {
    router.push(link.link)
  }
}
</script>

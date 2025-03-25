<template>
  <q-page class="flex flex-center column q-pa-xl">
    <q-icon name="block" size="100px" color="negative" />
    <div class="text-h5 q-mt-md text-center">Accès refusé</div>
    <div class="text-subtitle2 text-center q-mt-sm">
      Vous n’avez pas les droits pour accéder à cette page.
    </div>
    <q-btn
      label="Retour à l'accueil"
      color="primary"
      class="q-mt-md"
      icon="home"
      @click="router.push('/')"
    />
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

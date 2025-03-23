<template>
  <q-page class="flex flex-center column q-pa-xl">
    <q-icon name="block" size="100px" color="negative" />
    <div class="text-h5 q-mt-md text-center">Accès refusé</div>
    <div class="text-subtitle2 text-center q-mt-sm">
      Redirection vers la page de connexion dans {{ countdown }} secondes...
    </div>
    <q-btn
      label="Retour immédiat"
      color="primary"
      class="q-mt-md"
      icon="login"
      @click="goToLogin"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const countdown = ref(5)

const goToLogin = () => {
  router.push('/auth')
}

onMounted(() => {
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      goToLogin()
    }
  }, 1000)
})
</script>

<style scoped>
/* Style léger, déjà bien centré avec Quasar */
</style>

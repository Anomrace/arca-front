<template>
  <q-item
    clickable
    tag="router-link"
    :to="props.link"
    :active="route.path === props.link"
    active-class="active-link"
  >
    <q-item-section v-if="props.icon" avatar>
      <q-icon :name="props.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ props.title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    default: '',
  },

  icon: {
    type: String,
    default: '',
  },
})
</script>
<style scoped>
/* Appliquer un style personnalisé pour l'élément actif */
.active-link {
  background: #e0e0e0;
  color: #1976d2;
}
</style>

<template>
  <h1>Etudiants</h1>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card class="my-card" bordered>
      <!-- Section contenant l'avatar et le titre -->
      <q-card-section class="row items-center">
        <q-avatar size="50px">
          <img src="https://cdn.quasar.dev/img/parallax2.jpg" alt="Avatar" />
        </q-avatar>
        <div class="q-ml-sm">
          <div class="text-h5 q-mt-sm q-mb-xs flex">
            <div class="firstName">John</div>
            <div>Doe</div>
          </div>
        </div>
        <q-card-actions>
          <q-btn color="primary" icon="edit" />
          <q-btn color="secondary" icon="delete" />

          <q-btn
            color="grey"
            round
            dense
            :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
            @click="expanded = !expanded"
          />
        </q-card-actions>
      </q-card-section>

      <!-- Actions de la carte -->

      <!-- Contenu déroulant -->
      <q-slide-transition>
        <div v-show="expanded">
          <q-separator />
          <q-card-section class="text-subtitle2">
            {{ lorem }}
          </q-card-section>
        </div>
      </q-slide-transition>
    </q-card>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    return {
      expanded: ref(false),
      lorem:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    }
  },
}
</script>

<style lang="sass" scoped>
h1
  text-align: center
  font-size: 2em
  padding: 20px


.firstName
  margin-right: 5px
</style>

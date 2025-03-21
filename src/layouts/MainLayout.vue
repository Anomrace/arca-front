<template>
  <q-layout view="hHh lpR fFf">
    <!-- En-tête -->
    <q-header elevated>
      <q-toolbar>
        <!-- Bouton pour ouvrir/fermer le menu latéral -->

        <ToolbarTitle />
        <q-btn flat round icon="menu" @click="drawer = !drawer" />
      </q-toolbar>
    </q-header>

    <!-- Menu latéral (drawer) sur le côté droit -->
    <q-drawer v-model="drawer" side="right" bordered>
      <q-list>
        <q-item-label header class="q-pa-md">Menu</q-item-label>
        <q-item v-for="link in linksList" :key="link.title" clickable @click="goTo(link)">
          <q-item-section avatar>
            <q-icon :name="link.icon" />
          </q-item-section>
          <q-item-section>{{ link.title }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Contenu principal -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <q-page-sticky position="bottom-right" :offset="[20, 16]">
      <q-fab icon="add" color="primary" vertical-actions-align="right" direction="up">
        <!-- Boutons du menu avec icône + texte -->
        <q-fab-action
          v-for="action in actionsList"
          :key="action.title"
          :icon="action.icon"
          :label="action.title"
          color="primary"
          fab-mini
          @click="handleAction(action)"
        />
      </q-fab>
    </q-page-sticky>
    <!-- Modal pour "Ajouter un élève" -->
    <q-dialog v-model="showStudentModal">
      <q-card>
        <q-card-section>
          <div class="text-h6">Ajouter un nouvel élève</div>
          <!-- Ici, insérez le formulaire ou le contenu nécessaire -->
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Annuler" @click="showStudentModal = false" />
          <q-btn flat label="Ajouter" @click="submitNewStudent" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal pour "Nouvelle facture" (exemple) -->
    <q-dialog v-model="showInvoiceModal">
      <q-card>
        <q-card-section>
          <div class="text-h6">Créer une nouvelle facture</div>
          <!-- Contenu ou formulaire de la facture -->
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Annuler" @click="showInvoiceModal = false" />
          <q-btn flat label="Enregistrer" @click="submitNewInvoice" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ToolbarTitle from 'src/components/ToolbarTitle.vue'
import useAuth from 'src/composables/useAuth'
const { logout } = useAuth()
const drawer = ref(false)
const router = useRouter()
const showStudentModal = ref(false)
const showInvoiceModal = ref(false)

const linksList = [
  { title: 'Accueil', icon: 'dashboard', link: '/' },
  { title: 'Elèves', icon: 'people', link: '/students' },
  { title: 'Professeurs', icon: 'school', link: '/staff' },
  { title: 'Factures', icon: 'attach_money', link: '/invoices' },
  { title: 'Calendrier', icon: 'event', link: '/calendar' },
  { title: 'Ressources', icon: 'language', link: '/resources' },
  { title: 'Budget', icon: 'account_balance', link: '/expenses' },
  { title: 'Paramètres', icon: 'settings', link: '/settings' },
  { title: 'Déconnexion', icon: 'logout', action: 'logout' },
]

const actionsList = [
  { title: 'Nouvel élève', icon: 'person_add', action: 'addStudent' },
  { title: 'Nouvelle facture', icon: 'attach_money', action: 'addInvoice' },
]

function handleAction(action) {
  if (action.action === 'addStudent') {
    showStudentModal.value = true
  } else if (action.action === 'addInvoice') {
    showInvoiceModal.value = true
  }
}
function submitNewStudent() {
  // Logique pour ajouter un nouvel élève
  console.log('Nouvel élève ajouté')
  showStudentModal.value = false
}

function submitNewInvoice() {
  // Logique pour créer une nouvelle facture
  console.log('Nouvelle facture créée')
  showInvoiceModal.value = false
}

function goTo(linkOrAction) {
  if (linkOrAction.action === 'logout') {
    logout()
  } else {
    router.push(linkOrAction.link)
  }
  drawer.value = false
}
</script>

<style scoped>
/* Vous pouvez ajouter des styles spécifiques ici si besoin */
</style>

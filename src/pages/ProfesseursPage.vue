<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <div class="col">
        <q-input
          dense
          outlined
          debounce="300"
          v-model="search"
          placeholder="Rechercher un professeur..."
        />
      </div>
      <div class="col-auto">
        <q-btn label="Ajouter" color="primary" icon="add" @click="openAddDialog" />
      </div>
    </div>

    <!-- TABLE desktop -->
    <q-table
      v-if="!isMobile"
      title="Liste des professeurs"
      :rows="filtered"
      :columns="columns"
      row-key="id"
      flat
      bordered
      dense
      :loading="store.loading"
    />

    <!-- CARDS mobile -->
    <div v-else class="q-gutter-md">
      <q-card v-for="prof in filtered" :key="prof.id" bordered>
        <q-card-section>
          <div class="text-subtitle1">{{ prof.prenom }} {{ prof.nom }}</div>
          <div class="text-caption">Matière : {{ prof.matiere }}</div>
          <div class="text-caption">Email : {{ prof.email }}</div>
          <div class="text-caption">Téléphone : {{ prof.telephone }}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat icon="edit" color="primary" @click="onEdit(prof)" />
          <q-btn flat icon="delete" color="negative" @click="onDelete(prof)" />
        </q-card-actions>
      </q-card>
    </div>

    <!-- DIALOG -->
    <q-dialog v-model="dialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ editing ? 'Modifier' : 'Ajouter' }} un professeur</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input v-model="form.nom" label="Nom" dense outlined />
          <q-input v-model="form.prenom" label="Prénom" dense outlined />
          <q-input v-model="form.email" label="Email" dense outlined />
          <q-input v-model="form.telephone" label="Téléphone" dense outlined />
          <q-input v-model="form.matiere" label="Matière" dense outlined />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Annuler" color="primary" @click="closeDialog" />
          <q-btn flat label="Enregistrer" color="primary" @click="submit" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProfesseursStore } from 'stores/professeurs'
import { useQuasar, Dialog } from 'quasar'

const $q = useQuasar()
const store = useProfesseursStore()

const search = ref('')
const dialogOpen = ref(false)
const editing = ref(false)
const editedId = ref(null)

const form = ref({
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  matiere: '',
})

const isMobile = computed(() => $q.screen.lt.md)

const columns = [
  { name: 'nom', label: 'Nom', field: 'nom', sortable: true },
  { name: 'prenom', label: 'Prénom', field: 'prenom', sortable: true },
  { name: 'email', label: 'Email', field: 'email', sortable: true },
  { name: 'telephone', label: 'Téléphone', field: 'telephone', sortable: true },
  { name: 'matiere', label: 'Matière', field: 'matiere', sortable: true },
]

const filtered = computed(() => {
  const term = search.value.toLowerCase()
  return store.list.filter((p) =>
    Object.values(p).some((v) => String(v).toLowerCase().includes(term)),
  )
})

onMounted(() => {
  store.fetchProfesseurs()
})

function resetForm() {
  form.value = { nom: '', prenom: '', email: '', telephone: '', matiere: '' }
  editedId.value = null
  editing.value = false
}

function openAddDialog() {
  resetForm()
  dialogOpen.value = true
}

function onEdit(prof) {
  form.value = { ...prof }
  editedId.value = prof.id
  editing.value = true
  dialogOpen.value = true
}

function closeDialog() {
  dialogOpen.value = false
  resetForm()
}

async function submit() {
  if (!form.value.nom || !form.value.prenom) {
    $q.notify({ type: 'warning', message: 'Nom et prénom requis', icon: 'warning' })
    return
  }

  try {
    if (editing.value) {
      await store.updateProfesseur(editedId.value, { ...form.value })
      $q.notify({ type: 'positive', message: 'Professeur modifié', icon: 'check' })
    } else {
      await store.addProfesseur({ ...form.value })
      $q.notify({ type: 'positive', message: 'Professeur ajouté', icon: 'check' })
    }

    closeDialog()
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Erreur lors de l’enregistrement', icon: 'error' })
  }
}

function onDelete(prof) {
  Dialog.create({
    title: 'Confirmation',
    message: `Supprimer ${prof.prenom} ${prof.nom} ?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await store.deleteProfesseur(prof.id)
      $q.notify({ type: 'positive', message: 'Professeur supprimé', icon: 'delete' })
    } catch (err) {
      console.error(err)
      $q.notify({ type: 'negative', message: 'Erreur lors de la suppression', icon: 'error' })
    }
  })
}
</script>

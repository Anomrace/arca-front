<template>
  <q-dialog v-model="dialogOpen" persistent>
    <q-card style="min-width: 400px; max-width: 90vw">
      <q-card-section>
        <div class="text-h6">{{ editing ? 'Modifier un événement' : 'Créer un événement' }}</div>
      </q-card-section>

      <q-card-section class="q-gutter-md">
        <q-select
          v-model="form.eleve_id"
          :options="eleveOptions"
          option-value="id"
          option-label="nomComplet"
          emit-value
          map-options
          label="Élève"
          dense
          outlined
        />

        <q-select
          v-model="form.professeur_id"
          :options="profOptions"
          option-value="id"
          option-label="nomComplet"
          emit-value
          map-options
          label="Professeur"
          dense
          outlined
        />

        <q-select
          v-model="form.discipline_id"
          :options="disciplineOptions"
          option-value="id"
          option-label="nom"
          emit-value
          map-options
          label="Discipline"
          dense
          outlined
        />

        <q-input v-model="form.date" label="Date" type="date" dense outlined />
        <q-input v-model="form.heure_debut" label="Heure de début" type="time" dense outlined />
        <q-input v-model="form.heure_fin" label="Heure de fin" type="time" dense outlined />

        <q-input v-model="form.titre" label="Titre (optionnel)" dense outlined />
        <q-input v-model="form.description" label="Description" type="textarea" dense outlined />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Annuler" v-close-popup />
        <q-btn flat color="primary" label="Enregistrer" @click="submit" />
        <q-btn v-if="editing" flat color="negative" label="Supprimer" @click="supprimer" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useEvenementsStore } from 'stores/evenements'
import { useElevesStore } from 'stores/eleves'
import { useProfesseursStore } from 'stores/professeurs'
import { useDisciplinesStore } from 'stores/disciplines'

const $q = useQuasar()
const evenementsStore = useEvenementsStore()
const elevesStore = useElevesStore()
const profsStore = useProfesseursStore()
const disciplinesStore = useDisciplinesStore()

const dialogOpen = ref(false)
const editing = ref(false)
const editedId = ref(null)

const form = ref({
  titre: '',
  date: '',
  heure_debut: '',
  heure_fin: '',
  professeur_id: null,
  eleve_id: null,
  discipline_id: null,
  description: '',
})

// ✅ Options formatées
const eleveOptions = computed(() =>
  elevesStore.list.map((e) => ({ ...e, nomComplet: `${e.prenom} ${e.nom}` })),
)
const profOptions = computed(() =>
  profsStore.list.map((p) => ({ ...p, nomComplet: `${p.prenom} ${p.nom}` })),
)
const disciplineOptions = computed(() => disciplinesStore.list)

function reset() {
  form.value = {
    titre: '',
    date: '',
    heure_debut: '',
    heure_fin: '',
    professeur_id: null,
    eleve_id: null,
    discipline_id: null,
    description: '',
  }
  editing.value = false
  editedId.value = null
}

async function submit() {
  try {
    if (!form.value.eleve_id || !form.value.professeur_id || !form.value.date) {
      $q.notify({ type: 'warning', message: 'Champs obligatoires manquants' })
      return
    }

    if (editing.value) {
      await evenementsStore.updateEvenement(editedId.value, form.value)
      $q.notify({ type: 'positive', message: 'Événement mis à jour' })
    } else {
      await evenementsStore.addEvenement(form.value)
      $q.notify({ type: 'positive', message: 'Événement ajouté' })
    }

    dialogOpen.value = false
    reset()
    evenementsStore.fetchEvenements()
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Erreur lors de l’enregistrement' })
  }
}

async function supprimer() {
  $q.dialog({
    title: 'Confirmation',
    message: 'Supprimer cet événement ?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await evenementsStore.deleteEvenement(editedId.value)
      $q.notify({ type: 'positive', message: 'Événement supprimé' })
      dialogOpen.value = false
      reset()
      evenementsStore.fetchEvenements()
    } catch (err) {
      console.error(err)
      $q.notify({ type: 'negative', message: 'Erreur suppression événement' })
    }
  })
}

// ✅ Pour usage externe
function openAdd(date = '', time = '') {
  reset()
  form.value.date = date
  form.value.heure_debut = time
  dialogOpen.value = true
}

function openEdit(evt) {
  form.value = { ...evt }
  editedId.value = evt.id
  editing.value = true
  dialogOpen.value = true
}

defineExpose({ openAdd, openEdit })

onMounted(async () => {
  await Promise.all([
    elevesStore.fetchEleves(),
    profsStore.fetchProfesseurs(),
    disciplinesStore.fetchDisciplines(),
  ])
})
</script>

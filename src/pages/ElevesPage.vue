<template>
  <q-page padding>
    <!-- Barre de recherche + bouton ajout (inchangés) -->
    <div class="row items-center q-mb-md">
      <div class="col">
        <q-input
          dense
          outlined
          debounce="300"
          v-model="search"
          placeholder="Rechercher un élève..."
        />
      </div>
      <div class="col-auto">
        <q-select
          v-model="statutFilter"
          :options="['Tous', 'actif', 'inactif', 'essai', 'potentiel']"
          label="Filtrer par statut"
          dense
          outlined
          style="min-width: 160px"
        />
      </div>

      <div class="col-auto">
        <q-btn label="Ajouter un élève" color="primary" icon="add" @click="dialogOpen = true" />
        <q-btn
          label="Importer CSV"
          icon="upload"
          color="secondary"
          class="q-ml-sm"
          @click="triggerCsvUpload"
        />
        <input
          type="file"
          ref="csvInput"
          accept=".csv"
          @change="onCsvSelected"
          style="display: none"
        />
        <q-btn
          label="Exporter CSV"
          icon="download"
          color="primary"
          class="q-ml-sm"
          @click="exportCsv"
        />
        <q-btn
          label="Supprimer sélection"
          icon="delete"
          color="negative"
          class="q-ml-sm"
          :disable="nothingSelected"
          @click="deleteSelected"
        />
      </div>
    </div>

    <!-- Mode TABLE desktop -->
    <q-table
      v-if="!isMobile"
      title="Liste des élèves"
      :rows="filteredEleves"
      :columns="columns"
      row-key="id"
      flat
      bordered
      dense
      :loading="store.loading"
      selection="multiple"
      v-model:selected="selectedEleves"
    >
      <template #body-cell-actions="props">
        <q-td align="right">
          <q-btn
            dense
            flat
            round
            icon="edit"
            color="primary"
            @click="onEdit(props.row)"
            class="q-mr-sm"
          />
          <q-btn dense flat round icon="delete" color="negative" @click="onDelete(props.row)" />
        </q-td>
      </template>
    </q-table>

    <!-- Mode CARDS mobile -->
    <div v-else class="q-gutter-md">
      <q-card
        v-for="eleve in filteredEleves"
        :key="eleve.id"
        bordered
        @touchstart="startSelectionMode"
        @mousedown.right.prevent="startSelectionMode"
        class="relative-position"
      >
        <q-card-section>
          <div class="text-subtitle1">{{ eleve.prenom }} {{ eleve.nom }}</div>
          <div class="text-caption text-grey">Instrument : {{ eleve.instrument }}</div>
          <div class="text-caption text-grey">Âge : {{ eleve.age }}</div>
          <div class="text-caption text-grey">
            Professeurs :
            {{ eleve.profs.map((p) => `${p.prof.prenom} ${p.prof.nom}`).join(', ') }}
          </div>
          <div class="text-caption text-grey">
            Disciplines :
            {{ eleve.disciplines?.map((d) => d.discipline.nom).join(', ') || '—' }}
          </div>

          <div class="text-caption text-grey">Statut : {{ eleve.statut }}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat icon="edit" color="primary" @click="onEdit(eleve)" />
          <q-btn flat icon="delete" color="negative" @click="onDelete(eleve)" />
        </q-card-actions>

        <q-checkbox
          v-if="selectionMode === 'active'"
          v-model="selectedCards"
          :val="eleve.id"
          class="absolute-top-right q-mt-sm q-mr-sm"
          dense
          color="primary"
        />
      </q-card>
    </div>

    <!-- Dialog d'ajout (inchangé) -->
    <q-dialog v-model="dialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ editing ? 'Modifier un élève' : 'Ajouter un élève' }}</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="form.nom" label="Nom" dense outlined />
          <q-input v-model="form.prenom" label="Prénom" dense outlined />
          <q-input v-model="form.age" label="Âge" type="number" dense outlined />
          <q-select
            v-model="selectedDisciplines"
            use-input
            use-chips
            new-value-mode="add"
            @new-value="onNewDiscipline"
            :options="disciplineOptions"
            label="Disciplines"
            multiple
            option-value="id"
            option-label="nom"
            emit-value
            map-options
            dense
            outlined
          />

          <q-select
            v-model="selectedProfs"
            :options="profOptions"
            label="Professeurs"
            multiple
            option-value="id"
            option-label="nomComplet"
            emit-value
            map-options
            dense
            outlined
          />
          <q-select
            v-model="form.statut"
            :options="['actif', 'inactif', 'essai', 'potentiel']"
            label="Statut"
            dense
            outlined
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Annuler" color="primary" @click="dialogOpen = false" />
          <q-btn flat label="Enregistrer" color="primary" @click="addEleve" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useElevesStore } from 'stores/eleves'
import { useQuasar, Dialog } from 'quasar'
import { useProfesseursStore } from 'stores/professeurs'
import Papa from 'papaparse'
const statutFilter = ref('Tous')

const $q = useQuasar()
const isMobile = computed(() => $q.screen.lt.md)
const editing = ref(false)
const editedId = ref(null)

const store = useElevesStore()

const search = ref('')
const dialogOpen = ref(false)

const form = ref({ nom: '', prenom: '', age: null, statut: '' })

const columns = [
  { name: 'nom', label: 'Nom', field: 'nom', sortable: true },
  { name: 'prenom', label: 'Prénom', field: 'prenom', sortable: true },
  { name: 'age', label: 'Âge', field: 'age', sortable: true },
  { name: 'instrument', label: 'Instrument', field: 'instrument', sortable: true },
  {
    name: 'statut',
    label: 'Statut',
    field: 'statut',
    sortable: true,
  },
  {
    name: 'disciplines',
    label: 'Disciplines',
    field: (row) => row.disciplines?.map((d) => d.discipline.nom).join(', '),
    sortable: false,
  },

  {
    name: 'profs',
    label: 'Professeurs',
    field: (row) => row.profs?.map((p) => `${p.prof.prenom} ${p.prof.nom}`).join(', '),
    sortable: false,
  },
  {
    name: 'actions',
    label: '',
    field: 'id',
    sortable: false,
  },
]

const filteredEleves = computed(() => {
  const term = search.value.toLowerCase()
  return store.list
    .filter((e) => {
      if (statutFilter.value !== 'Tous') return e.statut === statutFilter.value
      return true
    })
    .filter((e) => Object.values(e).some((v) => String(v).toLowerCase().includes(term)))
})

function onEdit(eleve) {
  form.value = { ...eleve }
  selectedProfs.value = eleve.profs?.map((p) => p.prof.id) || []
  editedId.value = eleve.id
  editing.value = true
  dialogOpen.value = true
}
async function onDelete(eleve) {
  try {
    console.log('🗑 Suppression de :', eleve)

    Dialog.create({
      title: 'Confirmer',
      message: `Supprimer ${eleve.prenom} ${eleve.nom} ?`,
      cancel: true,
      persistent: true,
    }).onOk(async () => {
      await store.deleteEleve(eleve.id)
      $q.notify({ type: 'positive', message: 'Élève supprimé' })
    })
  } catch (err) {
    console.error('❌ Erreur suppression élève:', err)
    $q.notify({ type: 'negative', message: 'Erreur lors de la suppression' })
  }
}
async function addEleve() {
  if (!form.value.nom || !form.value.prenom) {
    $q.notify({ type: 'warning', message: 'Nom et prénom requis', icon: 'warning' })
    return
  }

  try {
    let eleveId = editedId.value

    // On nettoie l'objet pour éviter d'envoyer `profs` ou autre champ non stocké
    const { profs, ...payload } = form.value
    console.log(profs)

    if (editing.value) {
      // 1. Update l'élève
      await store.updateEleve(eleveId, payload)
      console.log('👀 Profs sélectionnés pour l’élève :', selectedProfs.value)

      // 2. Update relations professeurs
      await store.setProfesseurs(eleveId, selectedProfs.value)

      $q.notify({ type: 'positive', message: 'Élève modifié', icon: 'check' })
    } else {
      // 1. Ajout élève
      eleveId = await store.addEleve(payload)

      // 2. Ajout relations profs
      await store.setProfesseurs(eleveId, selectedProfs.value)

      $q.notify({ type: 'positive', message: 'Élève ajouté', icon: 'check' })
    }

    dialogOpen.value = false
    resetForm()
    store.fetchEleves()
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Erreur lors de l’enregistrement', icon: 'error' })
  }
}

const profStore = useProfesseursStore()
onMounted(async () => {
  await Promise.all([store.fetchEleves(), profStore.fetchProfesseurs()])
  console.log('📦 Élèves récupérés avec profs :', store.list)
})

const selectedProfs = ref([])

const profOptions = computed(() =>
  profStore.list.map((p) => ({
    ...p,
    nomComplet: `${p.prenom} ${p.nom}`,
  })),
)

function resetForm() {
  form.value = {
    nom: '',
    prenom: '',
    age: null,
    instrument: '',
    statut: 'actif',
  }
  selectedProfs.value = []
  editing.value = false
  editedId.value = null
}

async function onCsvUpload(files) {
  const file = files[0]

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: async (results) => {
      try {
        const rows = results.data
        const validRows = rows.filter((r) => r.nom && r.prenom)

        for (const row of validRows) {
          const eleve = {
            nom: row.nom,
            prenom: row.prenom,
            age: Number(row.age) || null,
            instrument: row.instrument || '',
            statut: row.statut || 'actif',
          }

          await store.addEleve(eleve)
        }

        $q.notify({ type: 'positive', message: 'Importation réussie' })
        await store.fetchEleves()
      } catch (err) {
        console.error('❌ CSV import error:', err)
        $q.notify({ type: 'negative', message: 'Erreur pendant l’import' })
      }
    },
  })
}

const csvInput = ref(null)

function triggerCsvUpload() {
  csvInput.value?.click()
}

function onCsvSelected(event) {
  const file = event.target.files[0]
  if (!file) return
  onCsvUpload([file]) // Réutilise ta fonction déjà faite
  event.target.value = null // reset input file
}
function exportCsv() {
  const source = isMobile.value ? selectedCards.value : selectedEleves.value

  const rowsToExport =
    source.length > 0
      ? filteredEleves.value.filter((e) => source.includes(e.id))
      : filteredEleves.value

  const csvData = rowsToExport.map((e) => ({
    nom: e.nom,
    prenom: e.prenom,
    age: e.age,
    instrument: e.instrument,
    statut: e.statut,
    professeurs: e.profs?.map((p) => `${p.prof.prenom} ${p.prof.nom}`).join(', ') || '',
  }))

  const csv = Papa.unparse(csvData)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'eleves-export.csv'
  link.click()
}
const selectedEleves = ref([]) // pour table
const selectedCards = ref([]) // pour mobile
const selectionMode = ref('none') // 'none' | 'active'

function startSelectionMode() {
  selectionMode.value = 'active'
}

const nothingSelected = computed(() => {
  return isMobile.value ? selectedCards.value.length === 0 : selectedEleves.value.length === 0
})

async function deleteSelected() {
  const idsToDelete = isMobile.value
    ? [...selectedCards.value]
    : selectedEleves.value.map((e) => e.id)

  if (!idsToDelete.length) return

  Dialog.create({
    title: 'Confirmation',
    message: `Supprimer ${idsToDelete.length} élève(s) ?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      for (const id of idsToDelete) {
        await store.deleteEleve(id)
      }

      $q.notify({ type: 'positive', message: 'Élèves supprimés' })

      selectedCards.value = []
      selectedEleves.value = []
      selectionMode.value = 'none'

      await store.fetchEleves()
    } catch (err) {
      console.error(err)
      $q.notify({ type: 'negative', message: 'Erreur suppression' })
    }
  })
}
</script>

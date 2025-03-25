<template>
  <q-page class="q-pa-md">
    <q-toolbar>
      <q-toolbar-title>Professeurs</q-toolbar-title>
      <q-btn color="primary" icon="add" label="Ajouter" @click="showModal = true" />
    </q-toolbar>

    <q-table :rows="professors" :columns="columns" row-key="id" flat bordered />

    <!-- Modal ajout prof -->
    <q-dialog v-model="showModal">
      <q-card>
        <q-card-section>
          <div class="text-h6">Ajouter un professeur</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="form.firstName" label="Prénom" filled class="q-mb-sm" />
          <q-input v-model="form.lastName" label="Nom" filled class="q-mb-sm" />
          <q-input v-model="form.email" label="Email" filled class="q-mb-sm" />
          <q-input v-model="form.phone" label="Téléphone" filled class="q-mb-sm" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Annuler" v-close-popup />
          <q-btn flat label="Enregistrer" color="primary" @click="addProfessor" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from 'boot/supabase'

const professors = ref([])
const showModal = ref(false)

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
})

const columns = [
  { name: 'firstName', label: 'Prénom', field: 'first_name', align: 'left' },
  { name: 'lastName', label: 'Nom', field: 'last_name', align: 'left' },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'phone', label: 'Téléphone', field: 'phone', align: 'left' },
]

onMounted(() => {
  fetchProfessors()
})

async function fetchProfessors() {
  const userId = (await supabase.auth.getUser()).data.user.id

  const { data: school } = await supabase
    .from('schools')
    .select('id')
    .eq('owner_id', userId)
    .single()

  if (!school) return

  const { data } = await supabase.from('professors').select('*').eq('school_id', school.id)

  professors.value = data || []
}

async function addProfessor() {
  const userId = (await supabase.auth.getUser()).data.user.id

  const { data: school } = await supabase
    .from('schools')
    .select('id')
    .eq('owner_id', userId)
    .single()

  const { error } = await supabase.from('professors').insert({
    school_id: school.id,
    first_name: form.value.firstName,
    last_name: form.value.lastName,
    email: form.value.email,
    phone: form.value.phone,
  })

  if (!error) {
    showModal.value = false
    form.value = { firstName: '', lastName: '', email: '', phone: '' }
    fetchProfessors()
  }
}
</script>

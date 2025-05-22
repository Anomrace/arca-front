import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from 'boot/supabase'

export const useEvenementsStore = defineStore('evenements', () => {
  const list = ref([])
  const loading = ref(false)

  async function fetchEvenements() {
    loading.value = true

    const { data, error } = await supabase
      .from('evenements')
      .select(
        `
    *,
    prof:professeurs ( id, nom, prenom ),
    eleve:eleves!evenements_eleve_id_fkey ( id, nom, prenom ),
    discipline:disciplines ( id, nom, type ),
    lieu:lieux ( id, nom ),
    ecole:ecoles ( id, nom )
  `,
      )
      .order('date', { ascending: true })

    if (!error) {
      list.value = data
    } else {
      console.error('❌ fetchEvenements error:', error)
    }

    loading.value = false
  }

  async function addEvenement(evt) {
    const { data, error } = await supabase.from('evenements').insert([evt]).select()
    if (error) throw error
    list.value.push(data[0])
    return data[0].id
  }

  async function updateEvenement(id, data) {
    const { error } = await supabase.from('evenements').update(data).eq('id', id)
    if (error) throw error

    const idx = list.value.findIndex((e) => e.id === id)
    if (idx !== -1) list.value[idx] = { ...list.value[idx], ...data }
  }

  async function deleteEvenement(id) {
    const { error } = await supabase.from('evenements').delete().eq('id', id)
    if (error) throw error
    list.value = list.value.filter((e) => e.id !== id)
  }

  function reset() {
    list.value = []
  }

  return {
    list,
    loading,
    fetchEvenements,
    addEvenement,
    updateEvenement,
    deleteEvenement,
    reset,
  }
})

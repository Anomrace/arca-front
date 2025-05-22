import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../boot/supabase'

export const useElevesStore = defineStore('eleves', () => {
  const list = ref([])
  const loading = ref(false)

  async function fetchEleves() {
    loading.value = true

    const { data, error } = await supabase.from('eleves').select(`
      *,
      profs:eleve_professeur (
        prof:professeurs (
          id, nom, prenom, matiere
        )
      ),
      disciplines:eleves_disciplines (
        discipline:disciplines (
          id, nom, type
        )
      )
    `)

    if (!error) list.value = data
    else console.error('❌ fetchEleves error:', error.message)

    loading.value = false
  }

  async function addEleve(eleve) {
    const { data, error } = await supabase.from('eleves').insert([eleve]).select()
    if (error) throw error
    list.value.push(data[0])
    return data[0].id
  }

  async function updateEleve(id, updates) {
    const { error } = await supabase.from('eleves').update(updates).eq('id', id)
    if (error) throw error

    const idx = list.value.findIndex((e) => e.id === id)
    if (idx !== -1) list.value[idx] = { ...list.value[idx], ...updates }
  }

  async function deleteEleve(id) {
    const { error } = await supabase.from('eleves').delete().eq('id', id)
    if (error) throw error
    list.value = list.value.filter((e) => e.id !== id)
  }

  async function setProfesseurs(eleveId, profIds) {
    await supabase.from('eleve_professeur').delete().eq('eleve_id', eleveId)

    if (!profIds.length) return

    const relations = profIds.map((pid) => ({
      eleve_id: eleveId,
      professeur_id: pid,
    }))

    const { error } = await supabase.from('eleve_professeur').insert(relations)
    if (error) throw error
  }

  async function setDisciplines(eleveId, disciplineIds) {
    await supabase.from('eleves_disciplines').delete().eq('eleve_id', eleveId)

    if (!disciplineIds.length) return

    const relations = disciplineIds.map((id) => ({
      eleve_id: eleveId,
      discipline_id: id,
    }))

    const { error } = await supabase.from('eleves_disciplines').insert(relations)
    if (error) throw error
  }

  return {
    list,
    loading,
    fetchEleves,
    addEleve,
    updateEleve,
    deleteEleve,
    setProfesseurs,
    setDisciplines,
  }
})

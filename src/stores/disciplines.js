// stores/disciplines.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from 'boot/supabase'

export const useDisciplinesStore = defineStore('disciplines', () => {
  const list = ref([])
  const loading = ref(false)

  // 🔁 GET all disciplines
  async function fetchDisciplines() {
    loading.value = true

    const { data, error } = await supabase.from('disciplines').select('*') // 👈 tu peux rajouter les jointures ici si besoin

    if (!error) {
      list.value = data
    } else {
      console.error('❌ fetchDisciplines error:', error.message)
    }

    loading.value = false
  }

  // ➕ ADD discipline
  async function addDiscipline(discipline) {
    const { data, error } = await supabase.from('disciplines').insert([discipline]).select()
    if (error) throw error
    list.value.push(data[0])
    return data[0]
  }

  // ✏️ UPDATE discipline
  async function updateDiscipline(id, updates) {
    const { error } = await supabase.from('disciplines').update(updates).eq('id', id)
    if (error) throw error

    const idx = list.value.findIndex((d) => d.id === id)
    if (idx !== -1) list.value[idx] = { ...list.value[idx], ...updates }
  }

  // ❌ DELETE discipline
  async function deleteDiscipline(id) {
    const { error } = await supabase.from('disciplines').delete().eq('id', id)
    if (error) throw error
    list.value = list.value.filter((d) => d.id !== id)
  }

  // ✅ CRÉER SI ABSENTE (libre dans formulaire)
  async function createIfNotExists(nom, type = 'instrument') {
    const existing = list.value.find((d) => d.nom.toLowerCase() === nom.toLowerCase())
    if (existing) return existing

    const { data, error } = await supabase.from('disciplines').insert([{ nom, type }]).select()

    if (error) throw error

    const created = data[0]
    list.value.push(created)
    return created
  }

  return {
    list,
    loading,
    fetchDisciplines,
    addDiscipline,
    updateDiscipline,
    deleteDiscipline,
    createIfNotExists,
  }
})

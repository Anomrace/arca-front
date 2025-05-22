import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from 'boot/supabase'

export const useProfesseursStore = defineStore('professeurs', () => {
  const list = ref([])
  const loading = ref(false)

  // 📥 Lire tous les professeurs
  async function fetchProfesseurs() {
    loading.value = true
    const { data, error } = await supabase
      .from('professeurs')
      .select('*')
      .order('nom', { ascending: true })

    if (!error) {
      list.value = data
    } else {
      console.error('❌ fetchProfesseurs error:', error.message)
    }

    loading.value = false
  }

  // ➕ Ajouter un professeur
  async function addProfesseur(prof) {
    const { data, error } = await supabase.from('professeurs').insert([prof]).select() // récupère l'UUID généré automatiquement

    if (!error && data?.length) {
      list.value.push(data[0])
    } else {
      console.error('❌ addProfesseur error:', error?.message)
      throw error
    }
  }

  // ✏️ Modifier un professeur
  async function updateProfesseur(id, updated) {
    const { error } = await supabase.from('professeurs').update(updated).eq('id', id)

    if (!error) {
      const idx = list.value.findIndex((p) => p.id === id)
      if (idx !== -1) {
        list.value[idx] = { ...updated, id }
      }
    } else {
      console.error('❌ updateProfesseur error:', error?.message)
      throw error
    }
  }

  // 🗑 Supprimer un professeur
  async function deleteProfesseur(id) {
    const { error } = await supabase.from('professeurs').delete().eq('id', id)

    if (!error) {
      list.value = list.value.filter((p) => p.id !== id)
    } else {
      console.error('❌ deleteProfesseur error:', error?.message)
      throw error
    }
  }

  return {
    list,
    loading,
    fetchProfesseurs,
    addProfesseur,
    updateProfesseur,
    deleteProfesseur,
  }
})

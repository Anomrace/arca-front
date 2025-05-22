// stores/lieux.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from 'boot/supabase'

export const uselieuxStore = defineStore('lieux', () => {
  const list = ref([])
  const loading = ref(false)

  // 🔁 READ ALL
  async function fetch() {
    loading.value = true
    const { data, error } = await supabase.from('lieux').select('*')
    if (error) console.error('❌ fetch lieux:', error)
    else list.value = data
    loading.value = false
  }

  // ➕ CREATE
  async function add(ecole) {
    const { data, error } = await supabase.from('lieux').insert([ecole]).select()
    if (error) throw error
    list.value.push(data[0])
    return data[0]
  }

  // 📝 UPDATE
  async function update(id, payload) {
    const { error } = await supabase.from('lieux').update(payload).eq('id', id)
    if (error) throw error
    const index = list.value.findIndex((e) => e.id === id)
    if (index !== -1) list.value[index] = { ...list.value[index], ...payload }
  }

  // ❌ DELETE
  async function remove(id) {
    const { error } = await supabase.from('lieux').delete().eq('id', id)
    if (error) throw error
    list.value = list.value.filter((e) => e.id !== id)
  }

  return {
    list,
    loading,
    fetch,
    add,
    update,
    remove,
  }
})

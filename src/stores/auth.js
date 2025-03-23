import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from 'boot/supabase' // Assure-toi que l'instance est bien là

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)

  async function login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    console.log('🟢 login → data:', data)
    console.log('🔴 login → error:', error)

    if (error) throw error
    user.value = data.user
    return true
  }

  async function register({ email, password, firstName, lastName, role }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName,
          lastName,
          role, // 💡 stocké dans user_metadata
        },
      },
    })

    console.log('🟢 register → data:', data)
    console.log('🔴 register → error:', error)

    if (error) throw error
    user.value = data.user
    return true
  }

  async function fetchUser() {
    const { data, error } = await supabase.auth.getUser()
    console.log('🟡 fetchUser → data:', data)
    console.log('🔴 fetchUser → error:', error)

    if (data?.user) {
      user.value = data.user
    } else {
      user.value = null
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    user.value = null
  }

  return {
    user,
    login,
    register,
    fetchUser,
    logout,
  }
})

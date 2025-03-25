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

    await fetchUser() // 💡 recharge avec metadata complet
    return true
  }

  async function register({ email, password, firstName, lastName, role = 'admin' }) {
    const isProd = import.meta.env.MODE === 'production'

    const redirectUrl = isProd ? 'https://arcaapp.netlify.app/' : 'http://localhost:9000/'

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${redirectUrl}?confirmed=true`,
        data: {
          firstName: firstName || '',
          lastName: lastName || '',
          role: role || 'admin',
        },
      },
    })

    console.log('🟢 register → data:', data)
    console.log('🔴 register → error:', error)

    if (error) throw error
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

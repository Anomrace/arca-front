import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from 'boot/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isLoading = ref(false)

  // ✅ LOGIN
  async function login({ email, password }) {
    isLoading.value = true
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    console.log('🟢 login → data:', data)
    console.log('🔴 login → error:', error)
    isLoading.value = false

    if (error) throw error

    user.value = data.user
    return true
  }

  // ✅ REGISTER (admin par défaut)
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

  // ✅ FETCH USER
  async function fetchUser() {
    isLoading.value = true
    const { data, error } = await supabase.auth.getUser()
    console.log('🟡 fetchUser → data:', data)
    console.log('🔴 fetchUser → error:', error)
    isLoading.value = false

    if (error) {
      await logout()
      throw error
    }

    user.value = data?.user || null
  }

  // ✅ LOGOUT
  async function logout() {
    await supabase.auth.signOut()
    user.value = null
  }

  // ✅ ROLES UTILS
  function isAdmin() {
    return user.value?.user_metadata?.role === 'admin'
  }

  function hasRole(role) {
    return user.value?.user_metadata?.role === role
  }

  return {
    user,
    isLoading,
    login,
    register,
    fetchUser,
    logout,
    isAdmin,
    hasRole,
  }
})

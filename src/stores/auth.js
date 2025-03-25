import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from 'boot/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isLoading = ref(false)

  // ✅ Connexion
  async function login({ email, password }) {
    isLoading.value = true
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    isLoading.value = false

    if (error) throw error

    user.value = data.user

    // 🔧 Si le rôle est absent, on le fixe
    if (!user.value?.user_metadata?.role) {
      await updateUserRole('admin')
    }

    return true
  }

  // ✅ Inscription (admin par défaut)
  async function register({ email, password, firstName, lastName, role = 'admin' }) {
    const isProd = import.meta.env.MODE === 'production'

    const redirectUrl = isProd ? 'https://arcaapp.netlify.app/' : 'http://localhost:9000/'

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${redirectUrl}?confirmed=true`,
        data: {
          role,
          firstName,
          lastName,
        },
      },
    })

    if (error) {
      console.error('❌ register error:', error)
      throw error
    }

    return true
  }

  // ✅ Chargement du user
  async function fetchUser() {
    isLoading.value = true
    const { data, error } = await supabase.auth.getUser()
    isLoading.value = false

    if (error) {
      await logout()
      throw error
    }

    user.value = data?.user || null

    // 🔧 Patch si pas de rôle (cas confirmation email)
    if (user.value && !user.value.user_metadata?.role) {
      await updateUserRole('admin')
    }
  }

  // ✅ Forcer une mise à jour du rôle
  async function updateUserRole(role = 'admin') {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        role,
      },
    })

    if (error) throw error
    user.value = data.user
  }

  // ✅ Déconnexion
  async function logout() {
    await supabase.auth.signOut()
    user.value = null
  }

  // ✅ Utilitaires de rôle
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
    updateUserRole,
  }
})

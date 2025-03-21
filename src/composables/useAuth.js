// src/composables/useAuth.js
import { useRouter } from 'vue-router'
import { Dialog } from 'quasar'
import { api } from 'boot/axios'

export default function useAuth() {
  const router = useRouter()

  const login = async (credentials) => {
    try {
      const { data } = await api.post('/auth/login', credentials)
      localStorage.setItem('token', data.token)
      Dialog.create({ type: 'positive', message: 'Connexion réussie' })
      router.push('/')
    } catch (err) {
      Dialog.create({
        type: 'negative',
        message: err.response?.data?.message || 'Erreur de connexion',
      })
    }
  }

  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData)
      localStorage.setItem('token', data.token)
      Dialog.create({ type: 'positive', message: 'Inscription réussie' })
      router.push('/')
    } catch (err) {
      Dialog.create({
        type: 'negative',
        message: err.response?.data?.message || 'Erreur lors de l’inscription',
      })
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    router.push('/auth')
  }

  const isAuthenticated = () => !!localStorage.getItem('token')

  return {
    login,
    register,
    logout,
    isAuthenticated,
  }
}

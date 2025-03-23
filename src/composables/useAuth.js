import { ref } from 'vue'

import { api } from 'boot/axios'

const user = ref(null)

function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload
  } catch (error) {
    console.log(error)
    return null
  }
}

function setUserFromToken() {
  const token = localStorage.getItem('token')
  if (token) {
    user.value = decodeToken(token)
  } else {
    user.value = null
  }
}

async function login(payload) {
  const res = await api.post('/auth/login', payload)
  const token = res.data.token
  localStorage.setItem('token', token)
  setUserFromToken()
  return res.data // renvoie pour gestion dans le composant
}

async function register(payload) {
  const res = await api.post('/auth/register', payload)
  const token = res.data.token
  localStorage.setItem('token', token)
  setUserFromToken()
  return res.data
}

setUserFromToken()

export default function useAuth() {
  return {
    user,
    login,
    register,
    setUserFromToken,
  }
}

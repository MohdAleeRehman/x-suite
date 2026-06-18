import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/utils/api'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('xsuite_token') || null)
  const user = ref(JSON.parse(localStorage.getItem('xsuite_user') || 'null'))
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const displayName = computed(() => user.value?.displayName || 'Umair')

  const login = async (username, password) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/auth/login', { username, password })
      const { token: newToken, user: newUser } = response.data

      token.value = newToken
      user.value = newUser
      localStorage.setItem('xsuite_token', newToken)
      localStorage.setItem('xsuite_user', JSON.stringify(newUser))

      router.push('/')
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed. Please try again.'
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('xsuite_token')
    localStorage.removeItem('xsuite_user')
    router.push('/login')
  }

  const checkAuth = async () => {
    if (!token.value) return false
    try {
      const response = await api.get('/auth/me')
      user.value = response.data.user
      return true
    } catch {
      logout()
      return false
    }
  }

  return {
    token, user, loading, error,
    isAuthenticated, displayName,
    login, logout, checkAuth
  }
})

<template>
  <div class="login-page">
    <div class="login-top-bar"></div>
    <div class="login-header">
      <div class="login-header-inner">
        <div class="login-logo">X <span>Suite</span></div>
      </div>
    </div>

    <div class="login-container animate-fluid-view">
      <div class="login-card">
        <div class="login-title">Platform Access</div>
        <div class="login-sub">Sharjah Real Estate Transaction Suite</div>

        <div v-if="authStore.error" class="login-error">
          {{ authStore.error }}
        </div>

        <div class="field">
          <label>Username</label>
          <input
            v-model="username"
            type="text"
            placeholder="Enter username"
            @keyup.enter="handleLogin"
            autocomplete="username"
          />
        </div>

        <div class="field" style="margin-top: 16px;">
          <label>Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Enter password"
            @keyup.enter="handleLogin"
            autocomplete="current-password"
          />
        </div>

        <button
          class="btn-calc"
          style="margin-top: 24px;"
          :disabled="authStore.loading"
          @click="handleLogin"
        >
          {{ authStore.loading ? 'Authenticating...' : 'Sign In' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const username = ref('')
const password = ref('')

const handleLogin = () => {
  if (!username.value || !password.value) return
  authStore.login(username.value, password.value)
}
</script>

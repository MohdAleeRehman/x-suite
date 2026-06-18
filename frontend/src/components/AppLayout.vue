<template>
  <div>
    <!-- Loading Screen -->
    <div v-if="showLoader" class="loading-screen" :style="{ opacity: loaderVisible ? 1 : 0 }">
      <div class="loader-ring"></div>
      <div class="loader-title">SECURELY CONNECTING TO PLATFORM</div>
    </div>

    <!-- Top Red Bar -->
    <div class="hsbc-top-bar"></div>

    <!-- Navigation Header -->
    <div class="hsbc-nav-header">
      <div class="hsbc-nav-container">
        <div class="hsbc-logo-placeholder">
          Welcome, <span>{{ displayName }}!</span>
        </div>
        <button class="nav-logout-btn" @click="handleLogout">Sign Out</button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="w">
      <!-- Page Header -->
      <div class="hdr">
        <h1>{{ title }}</h1>
        <p>{{ subtitle }}</p>
      </div>

      <!-- Slot for page content -->
      <div :class="{ 'animate-fluid-view': animating }" @animationend="animating = false">
        <slot />
      </div>
    </div>

    <!-- Footer -->
    <div class="footer-cr">
      &copy; 2026 Umair Ikhlaq. All rights reserved.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  title: { type: String, default: 'X Suite - Real Estate Solutions' },
  subtitle: { type: String, default: 'Sharjah Property Transaction Suite' }
})

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const displayName = computed(() => authStore.displayName)
const showLoader = ref(true)
const loaderVisible = ref(true)
const animating = ref(false)

onMounted(() => {
  setTimeout(() => {
    loaderVisible.value = false
    setTimeout(() => {
      showLoader.value = false
    }, 400)
  }, 800)
})

watch(() => route.path, () => {
  animating.value = true
})

const handleLogout = () => {
  authStore.logout()
}
</script>

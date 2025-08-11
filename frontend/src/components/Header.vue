<template>
  <header class="sticky top-0 z-50 bg-neutral-950/70 backdrop-blur border-b border-neutral-800">
    <div class="container-page h-[var(--header-height)] flex items-center">
      <div class="flex-1 flex items-center">
        <button
          v-if="isAuthenticated"
          @click="goHome"
          class="btn btn-ghost"
          aria-label="Home"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
      </div>

      <h1 class="text-lg md:text-xl font-semibold">Prompt Optimizer</h1>

      <div class="flex-1 flex items-center justify-end gap-2">
        <template v-if="isAuthenticated">
          <button @click="goHistory" class="btn btn-ghost">History</button>
          <button @click="logout" class="btn btn-danger">Logout</button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()

const isAuthenticated = computed(() => {
  const token = localStorage.getItem('token')
  const isExpired = token ? new Date().getTime() > JSON.parse(atob(token.split('.')[1])).exp * 1000 : false
  return token !== null && !isExpired
})

const goHome = () => {
  router.push('/')
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

const goHistory = () => {
  router.push('/history')
}
</script>
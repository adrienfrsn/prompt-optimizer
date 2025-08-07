<template>
  <header class="bg-neutral-900 border-b border-neutral-700 p-4">
    <div class="max-w-4xl mx-auto flex items-center">
      <div class="flex-1 flex items-center">
        <button 
          v-if="isAuthenticated"
          @click="goHome"
          class="text-white hover:text-neutral-300 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
      </div>
      
      <h1 class="text-xl font-semibold text-white">Prompt Optimizer</h1>

      <div class="flex-1 flex items-center justify-end space-x-3">
        <template v-if="isAuthenticated">
          <button
            @click="goHistory"
            class="bg-white hover:bg-gray-100 text-black px-4 py-2 rounded transition-colors"
          >
            History
          </button>
          <button 
            @click="logout"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
          >
            Logout
          </button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();

const isAuthenticated = computed(() => {
  const token = localStorage.getItem('token');
  const isExpired = token ? new Date().getTime() > JSON.parse(atob(token.split('.')[1])).exp * 1000 : false;
  return token !== null && !isExpired;
});

const goHome = () => {
  router.push('/');
};

const logout = () => {
  localStorage.removeItem('token');
  router.push('/login');
};

const goHistory = () => {
    router.push("/history")
}
</script>
<template>
  <div class="min-h-screen bg-black text-white">
    <Header />
    <div class="p-6 flex items-center justify-center">
      <div class="w-full max-w-md flex flex-col gap-4">
      <h2 class="text-2xl font-semibold text-center">Login</h2>

      <div>
        <label for="username" class="block mb-1">Username:</label>
        <input 
          type="text" 
          id="username" 
          v-model="username" 
          class="bg-neutral-900 border border-neutral-700 rounded px-3 py-2 w-full text-white focus:outline-none"
        />
      </div>

      <div>
        <label for="password" class="block mb-1">Password:</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          class="bg-neutral-900 border border-neutral-700 rounded px-3 py-2 w-full text-white focus:outline-none"
        />
      </div>

      <button 
        @click="login"
        :disabled="!username || !password"
        class="border border-white text-white py-2 px-4 rounded hover:bg-white hover:text-black transition disabled:opacity-40"
      >
        Login
      </button>

      <div class="text-center mt-4">
          <p class="text-neutral-400">
            Don't have an account? 
            <button class="text-white hover:underline" @click="goRegister">Register here</button>
          </p>
        </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { showSuccess, showError } from '@/utils/toast'
import Header from '@/components/Header.vue'

const router = useRouter()

const username = ref<string>('')
const password = ref<string>('')

const login = async () => {
  try {
    const response = await axios.post('http://localhost:8080/api/auth/login', {
      username: username.value,
      password: password.value
    })
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      showSuccess('Connection successful!')
      router.push('/app');
    }
  } catch (error) {
    console.error('Error during login:', error)
    showError('Error during login')
  }
}

const goRegister = () => {
  router.push("/register");
}
</script>

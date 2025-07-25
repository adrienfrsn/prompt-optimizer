<template>
  <div class="min-h-screen bg-black text-white flex items-center justify-center p-6">
    <div class="w-full max-w-md flex flex-col gap-4">
      <h2 class="text-2xl font-semibold text-center">Register</h2>

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
        <label for="email" class="block mb-1">Email:</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
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
        @click="register"
        :disabled="!username || !password"
        class="border border-white text-white py-2 px-4 rounded hover:bg-white hover:text-black transition disabled:opacity-40"
      >
        Register
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { showSuccess, showError } from '@/utils/toast'

const router = useRouter()

const username = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')

const register = async () => {
  try {
    const response = await axios.post('http://localhost:8080/api/auth/register', {
      username: username.value,
      email: email.value,
      password: password.value,
      role: "ROLE_USER"
    })
    if (response.status === 200) {
      showSuccess('Registration successful!')
      router.push('/login');
    } else {
      showError('Error during registration')
    }
  } catch (error) {
    console.error('Error during registration:', error)
    showError('Error during registration')
  }
}
</script>

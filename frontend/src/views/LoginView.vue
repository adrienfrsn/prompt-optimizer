<template>
  <div class="min-h-screen bg-black text-white">
    <Header />
    <div class="p-6 flex items-center justify-center">
      <div class="w-full max-w-md flex flex-col gap-4">
        <div class="card">
          <div class="card-body flex flex-col gap-4">
            <h2 class="text-2xl font-semibold text-center">Login</h2>
            
            <div>
              <label for="username" class="label">Username</label>
              <input 
                type="text" 
                id="username" 
                v-model="username" 
                class="input"
              />
            </div>

            <div>
              <label for="password" class="label">Password</label>
              <input 
                type="password" 
                id="password" 
                v-model="password" 
                class="input"
              />
            </div>

            <button 
              @click="login"
              :disabled="!username || !password"
              class="btn-outline"
            >
              Login
            </button>

            <div class="text-center mt-2">
              <p class="text-neutral-400">
                Don't have an account? 
                <button class="text-white hover:underline" @click="goRegister">Register here</button>
              </p>
            </div>
          </div>
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

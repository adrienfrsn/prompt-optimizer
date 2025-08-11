<template>
  <div class="min-h-screen bg-black text-white">
    <Header />
    <div class="p-6 flex items-center justify-center">
      <div class="w-full max-w-md">
        <div class="card">
          <div class="card-body flex flex-col gap-4">
            <h2 class="text-2xl font-semibold text-center">Register</h2>

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
              <label for="email" class="label">Email</label>
              <input 
                type="email" 
                id="email" 
                v-model="email" 
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
              @click="register"
              :disabled="!username || !password"
              class="btn-outline"
            >
              Register
            </button>

            <div class="text-center mt-4">
              <p class="text-neutral-400">
                Already have an account? 
                <button class="text-white hover:underline" @click="goLogin">Login here</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { showSuccess, showError } from '@/utils/toast'
import Header from '../components/Header.vue'

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
    if (axios.isAxiosError(error) && error.response) {
      showError(error.response.data)
    } else {
      showError('Error during registration')
    }
  }
}

const goLogin = () => {
  router.push("/login");
}
</script>

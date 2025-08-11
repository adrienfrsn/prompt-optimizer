<template>
  <div class="container-page py-8">
    <div class="card">
      <div class="card-body">
        <h2 class="section-title">Improve your prompt</h2>

        <div class="space-y-4">
          <textarea 
            v-model="prompt" 
            placeholder="Your prompt here..." 
            rows="6"
            class="textarea"
          ></textarea>

          <div class="with-icon">
            <select 
              v-model="model"
              class="select"
            >
              <option value="" disabled selected>Choose a model</option>
              <option value="gpt-5">GPT-5</option>
              <option value="gpt-3.5">GPT-3.5</option>
              <option value="gpt-4">GPT-4</option>
              <option value="claude-3">Claude 3</option>
              <option value="claude-4">Claude 4</option>
              <option value="gemini-flash">Gemini Flash</option>
              <option value="gemini-pro">Gemini Pro</option>
              <option value="mistral">Mistral</option>
              <option value="llama-3">LLaMA 3</option>
            </select>
            <svg class="icon-right w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd" />
            </svg>
          </div>

          <div v-if="questions.length" class="mt-2">
            <h3 class="text-lg font-medium mb-3">The model needs clarification:</h3>
            <div v-for="(question, index) in questions" :key="index" class="mb-4">
              <label class="label">{{ question }}</label>
              <input 
                v-model="answers[index]"
                type="text"
                class="input"
              />
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button 
              @click="submitPrompt" 
              :disabled="!prompt || !model || (questions.length > 0 && answers.some(a => !a.trim())) || isLoading"
              class="btn btn-primary"
            >
              <svg
                v-if="isLoading"
                class="animate-spin h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  class="opacity-25"
                />
                <path
                  fill="currentColor"
                  d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  class="opacity-75"
                />
              </svg>
              <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M8 16l8-8m-5 0l1-3 3-1-1 3-3 1z" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span>
                {{ isLoading ? 'Processing...' : (questions.length ? 'Send informations' : 'Improve') }}
              </span>
            </button>

            <button
              v-if="optimizedPrompt"
              class="btn btn-ghost"
              @click="copyOptimized"
            >Copy optimized</button>
          </div>

          <div v-if="optimizedPrompt" class="mt-6">
            <h3 class="text-lg font-medium mb-3">Optimized prompt:</h3>
            <pre class="prose-pre card p-4 overflow-x-auto">{{ optimizedPrompt }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { showSuccess } from '@/utils/toast'


const prompt = ref<string>('')
const model = ref<string>('')
const optimizedPrompt = ref<string>('')
const questions = ref<string[]>([])
const answers = ref<string[]>([])
const isLoading = ref<boolean>(false)

const copyOptimized = async () => {
  try {
    await navigator.clipboard.writeText(optimizedPrompt.value)
    showSuccess('Prompt copied to clipboard!')
  } catch (e) {
    console.error('Copy failed', e)
  }
}

const submitPrompt = async () => {
  try {
    isLoading.value = true

    const response = await axios.post(
      'http://localhost:8080/api/prompt/improve',
      {
        prompt: buildPromptWithAnswers(),
        model: model.value
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    )

    isLoading.value = false

    optimizedPrompt.value = ''
    questions.value = []
    answers.value = []

    if (response.data.optimizedPrompt) {
      optimizedPrompt.value = response.data.optimizedPrompt
    } else if (response.data.questions) {
      questions.value = response.data.questions
      answers.value = Array(questions.value.length).fill('')
    }
  } catch (error) {
    console.error('Error during request:', error)
  }
}

const buildPromptWithAnswers = () => {
  if (!questions.value.length) return prompt.value

  let fullPrompt = prompt.value + '\n\nAdditional information:\n'
  questions.value.forEach((q, i) => {
    fullPrompt += `- ${q} ${answers.value[i]}\n`
  })
  return fullPrompt
}
</script>

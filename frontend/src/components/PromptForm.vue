<template>
  <div class="max-w-4xl mx-auto">
    <div class="flex items-center justify-center min-h-screen p-4">
      <div class="w-full max-w-md flex flex-col gap-4">
        <h2 class="text-2xl font-semibold text-center text-white mb-6">
          Improve your prompt
        </h2>

        <textarea 
          v-model="prompt" 
          placeholder="Your prompt here..." 
          rows="6"
          class="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 w-full text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        ></textarea>

        <select 
          v-model="model"
          class="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="" disabled selected>Choose a model</option>
          <option value="gpt-3.5">GPT-3.5</option>
          <option value="gpt-4">GPT-4</option>
          <option value="claude-3">Claude 3</option>
          <option value="claude-4">Claude 4</option>
          <option value="gemini-flash">Gemini Flash</option>
          <option value="gemini-pro">Gemini Pro</option>
          <option value="mistral">Mistral</option>
          <option value="llama-3">LLaMA 3</option>
        </select>

        <div v-if="questions.length" class="mt-4">
          <h3 class="text-lg font-medium mb-3 text-white">
            The model needs clarification:
          </h3>
          <div v-for="(question, index) in questions" :key="index" class="mb-4">
            <label class="block mb-2 text-white font-medium">
              {{ question }}
            </label>
            <input 
              v-model="answers[index]"
              type="text"
              class="bg-neutral-800 border border-neutral-600 rounded-lg px-3 py-2 w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button 
          @click="submitPrompt" 
          :disabled="!prompt || !model || (questions.length > 0 && answers.some(a => !a.trim())) || isLoading"
          class="border border-white text-white py-3 px-6 rounded-lg hover:bg-white hover:text-black transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2"
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
          <span>
            {{ isLoading ? 'Processing...' : (questions.length ? 'Send informations' : 'Improve') }}
          </span>
        </button>

        <div v-if="optimizedPrompt" class="mt-6">
          <h3 class="text-lg font-medium mb-3 text-white">
            Optimized prompt:
          </h3>
          <pre class="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 whitespace-pre-wrap text-white overflow-x-auto">{{ optimizedPrompt }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const prompt = ref<string>('')
const model = ref<string>('')
const optimizedPrompt = ref<string>('')
const questions = ref<string[]>([])
const answers = ref<string[]>([])
const isLoading = ref<boolean>(false)

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
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

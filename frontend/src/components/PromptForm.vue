<template>
  <div class="min-h-screen bg-black text-white flex items-center justify-center p-6">
    <div class="w-full max-w-md flex flex-col gap-4">
      <h2 class="text-2xl font-semibold text-center">Améliore ton prompt</h2>

      <textarea
        v-model="prompt"
        placeholder="Ton prompt ici..."
        rows="6"
        class="bg-neutral-900 border border-neutral-700 rounded px-3 py-2 w-full text-white resize-none focus:outline-none"
      ></textarea>

      <select
        v-model="model"
        class="bg-neutral-900 border border-neutral-700 rounded px-3 py-2 w-full text-white focus:outline-none"
      >
        <option value="" disabled selected>Choisis un modèle</option>
        <option>GPT-3.5</option>
        <option>GPT-4</option>
        <option>Claude 3</option>
        <option>Claude 4</option>
        <option>Gemini Flash</option>
        <option>Gemini Pro</option>
        <option>Mistral</option>
        <option>LLaMA 3</option>
      </select>

      <div v-if="questions.length" class="mt-2">
        <h3 class="text-lg font-medium mb-1">Le modèle a besoin de précisions :</h3>
        <div v-for="(question, index) in questions" :key="index" class="mb-3">
          <label class="block mb-1">{{ question }}</label>
          <input
            v-model="answers[index]"
            class="bg-neutral-800 border border-neutral-600 rounded px-3 py-2 w-full text-white focus:outline-none"
          />
        </div>
      </div>

      <button
        @click="submitPrompt"
        :disabled="!prompt || !model || (questions.length && answers.some(a => !a.trim()))"
        class="border border-white text-white py-2 px-4 rounded hover:bg-white hover:text-black transition disabled:opacity-40"
      >
        {{ questions.length ? 'Envoyer les infos' : 'Améliorer' }}
      </button>

      <div v-if="optimizedPrompt" class="mt-4">
        <h3 class="text-lg font-medium mb-1">Prompt optimisé :</h3>
        <pre class="bg-neutral-900 border border-neutral-700 rounded px-3 py-2 whitespace-pre-wrap">
{{ optimizedPrompt }}
        </pre>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const prompt = ref<string>('')
const model = ref<string>('')
const optimizedPrompt = ref<string>('')
const questions = ref<string[]>([])
const answers = ref<string[]>([])

const submitPrompt = async () => {
  try {
    const response = await axios.post('http://localhost:8080/api/prompt/improve', {
      prompt: buildPromptWithAnswers(),
      model: model.value
    })

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
    console.error('Erreur pendant la requête :', error)
  }
}

const buildPromptWithAnswers = () => {
  if (!questions.value.length) return prompt.value

  let fullPrompt = prompt.value + '\n\nInformations complémentaires :\n'
  questions.value.forEach((q, i) => {
    fullPrompt += `- ${q} ${answers.value[i]}\n`
  })
  return fullPrompt
}
</script>


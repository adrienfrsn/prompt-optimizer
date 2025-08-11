<template>
  <div class="min-h-screen bg-black text-white">
    <Header />
    <div class="container-page py-8">
      <div class="card">
        <div class="card-body">
          <h1 class="text-2xl font-semibold mb-6 text-center">History</h1>

          <div v-if="history.length > 0" class="space-y-6">
            <div 
              v-for="item in history" 
              :key="item.id"
              class="card border border-neutral-700"
            >
              <div class="card-body space-y-4">
                <div>
                  <label class="label">Original Prompt</label>
                  <div class="hover-tools relative">
                    <pre class="prose-pre bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-sm overflow-x-auto pr-10">{{ item.originalPrompt }}</pre>
                    <button class="icon-btn hover-show absolute top-2 right-2" @click="copy(item.originalPrompt)" aria-label="Copy original prompt">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div>
                  <label class="label">Optimized Prompt</label>
                  <div class="hover-tools relative">
                    <pre class="prose-pre bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-sm overflow-x-auto pr-10">{{ item.optimizedPrompt }}</pre>
                    <button class="icon-btn hover-show absolute top-2 right-2" @click="copy(item.optimizedPrompt)" aria-label="Copy optimized prompt">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div class="flex justify-between items-center text-sm text-neutral-400">
                  <span><strong>Model:</strong> {{ item.modelUsed }}</span>
                  <span>{{ new Date(item.timestamp).toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center text-neutral-400 mt-6">
            <p class="text-lg">No history items found</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from 'axios'
import Header from '../components/Header.vue';
import { showSuccess } from '@/utils/toast';

const history = ref<Array<{
  id: number;
  originalPrompt: string;
  optimizedPrompt: string;
  modelUsed: string;
  timestamp: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}>>([]);

const copy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    showSuccess('Copied to clipboard!')
  } catch {}
}

const fetchHistory = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/prompt/history', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    history.value = response.data;
  } catch (error) {
    console.error('Error fetching history:', error);
  }
};

onMounted(() => {
    fetchHistory();
});
</script>
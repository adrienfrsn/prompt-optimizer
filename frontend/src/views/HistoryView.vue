<template>
  <div class="min-h-screen bg-black text-white">
    <Header />
    <div class="p-6">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-semibold mb-8 text-center">History</h1>
      
      <div v-if="history.length > 0" class="space-y-6">
        <div 
          v-for="item in history" 
          :key="item.id"
          class="bg-neutral-900 border border-neutral-700 rounded-lg p-6"
        >
          <div class="mb-4">
            <label class="block text-sm font-medium text-neutral-300 mb-2">Original Prompt:</label>
            <div class="bg-neutral-800 border border-neutral-600 rounded p-3 text-sm">
              {{ item.originalPrompt }}
            </div>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-neutral-300 mb-2">Optimized Prompt:</label>
            <div class="bg-neutral-800 border border-neutral-600 rounded p-3 text-sm">
              {{ item.optimizedPrompt }}
            </div>
          </div>
          
          <div class="flex justify-between items-center text-sm text-neutral-400">
            <span><strong>Model:</strong> {{ item.modelUsed }}</span>
            <span>{{ new Date(item.timestamp).toLocaleString() }}</span>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center text-neutral-400 mt-12">
        <p class="text-lg">No history items found</p>
      </div>
    </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from 'axios'
import Header from '../components/Header.vue';

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

const fetchHistory = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/prompt/history', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    history.value = response.data;
    console.log('History fetched:', history.value);
  } catch (error) {
    console.error('Error fetching history:', error);
  }
};

onMounted(() => {
    fetchHistory();
});
</script>
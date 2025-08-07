<template>
  <div class="min-h-screen bg-black text-white">
    <Header />
    <div class="p-6">
      <PromptForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from '../components/Header.vue';
import PromptForm from '../components/PromptForm.vue';
</script>
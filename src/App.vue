<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <header class="container my-6">
    <h1 class="text-xl font-semibold inline text-primary-content mr-2">Steam Friends Library Compare</h1>
    <span class="text-sm text-secondary">version 1.0.0</span>
  </header>

  <main class="container">
    <RouterView />
  </main>
</template>


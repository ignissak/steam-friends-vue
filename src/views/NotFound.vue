<script setup lang="ts">
import { inject } from 'vue';

(inject('progress') as any).fail();
</script>
<template>
  <main class="container">
    <h1>Not found</h1>
    <p class="text-neutral-400">The page you are looking for could not be found.</p>
  </main>
</template>

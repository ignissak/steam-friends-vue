<script setup lang="ts">
import type { ProgressBar } from 'steam';
import { inject } from 'vue';

const progress = inject('progress') as ProgressBar;
progress.fail();
</script>
<template>
  <main class="container flex h-screen flex-col items-center justify-center">
    <h1>Not found</h1>
    <p class="text-neutral-400">The page you are looking for could not be found.</p>
    <router-link to="/" class="btn btn-sm mt-4 w-full">Back to home</router-link>
  </main>
</template>

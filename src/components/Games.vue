<script setup lang="ts">
// TODO: https://cdn.akamai.steamstatic.com/steam/apps/431960/header.jpg
import type { Comparison } from 'steam';
import { toRaw } from 'vue';

function splitArrayIntoChunks<T>(arr: T[], N: number): T[][] {
  const chunkSize = Math.ceil(arr.length / N);
  const result: T[][] = [];

  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    result.push(chunk);
  }

  return result;
}

const props = defineProps<{
  comparison: Comparison;
}>();

const comparison = toRaw(props.comparison); // we don't need this to be reactive
const NUM_WORKERS = 3; // TODO: thing about this number

// split many users into NUM_WORKERS chunks
const split = splitArrayIntoChunks(comparison.users, NUM_WORKERS);
console.log(split);

// send the users individually into the workers, wait until the worker is done before sending the next user
const resolverListener = (event: MessageEvent) => {
  console.log('Message from worker', event.data);
};

const workers: Worker[] = [];
for (let i = 0; i < NUM_WORKERS; i++) {
  const worker = new Worker('./scripts/games.worker.ts');
  worker.addEventListener('message', resolverListener);
  worker.postMessage(split[i]);
  workers.push(worker);
}
</script>

<template></template>

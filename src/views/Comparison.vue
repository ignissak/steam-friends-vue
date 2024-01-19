<script setup lang="ts">
import Games from '@/components/Games.vue';
import { useComparisonStore } from '@/stores/comparison';
import { useRoute, useRouter } from 'vue-router';

const comparisonStore = useComparisonStore();
const route = useRoute();
const router = useRouter();
const id = route.params.id;

let comparison = comparisonStore.pastComparisons.find((comparison) => comparison.id === id);
if (!comparison) {
  // TODO: Throw fancy error
  if (comparisonStore.currentComparison.id !== id) {
    console.error('Not found');
    router.push('/404');
  } else {
    comparison = comparisonStore.currentComparison;
  }
}

if (!comparison?.commonGames) {
  console.debug('Starting common games calculation...');
}
</script>

<template>
  <main class="container">
    <div class="mb-6 flex flex-col gap-2 sm:flex-row sm:gap-4">
      <h2>Comparing libraries of {{ comparison?.users.length }} users</h2>
      <div class="avatar-group -space-x-2 rtl:space-x-reverse">
        <template v-for="friend in comparison!!.users.slice(0, 5)" :key="friend.steamid">
          <div class="avatar">
            <div class="w-6">
              <img :src="friend.avatarfull" :alt="friend.personaname" />
            </div>
          </div>
        </template>
        <template v-if="comparison!!.users.length > 5">
          <div class="avatar placeholder">
            <div class="w-6 bg-neutral text-xs text-neutral-400">
              <span>{{ comparison!!.users.length - 5 }}+</span>
            </div>
          </div>
        </template>
      </div>
    </div>
    <Suspense>
      <template #default>
        <Games :comparison="comparison!!" />
      </template>
      <template #fallback>
        <div class="flex flex-col items-center justify-center">
          <div class="loader"></div>
          <p class="mt-4">Loading...</p>
        </div>
      </template>
    </Suspense>
  </main>
</template>

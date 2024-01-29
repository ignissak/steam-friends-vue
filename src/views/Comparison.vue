<script setup lang="ts">
import Games from '@/components/Games.vue';
import { useComparisonStore } from '@/stores/comparison';
import type { Game, User } from 'steam';
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
} else {
  comparisonStore.currentComparison = comparison;
}

if (!comparison?.calculated) {
  console.debug('Starting common games calculation...');
}

const onGamesCalculated = (entries: { game: Game; users: User[] }[]) => {
  if (comparison) {
    comparison.calculated = entries;
  }
  // add the comparison into past comparisons if it doesn't exist
  if (!comparisonStore.pastComparisons.find((comparison) => comparison.id === id)) {
    comparisonStore.pastComparisons.push(comparison!!);
  } else {
    // update it
    const index = comparisonStore.pastComparisons.findIndex((comparison) => comparison.id === id);
    comparisonStore.pastComparisons[index] = comparison!!;
  }
};
</script>

<template>
  <main class="container">
    <p class="text-xs text-neutral-700">{{ comparison?.id }}</p>
    <div class="mb-6 flex flex-col gap-2 sm:flex-row sm:gap-4 justify-between">
      <h2>Comparing libraries of {{ comparison?.users.length }} users</h2>
    </div>
    <Suspense>
      <template #default>
        <Games :comparison="comparison!!" @on-games-calculated="onGamesCalculated" />
      </template>
      <template #fallback>
        <section class="mt-9">
          <section class="mb-4 flex flex-col justify-between gap-1 md:flex-row md:gap-4">
            <div class="grow">
              <div class="suspense mb-1 h-5 w-20"></div>
              <div class="suspense h-6 w-full"></div>
            </div>
            <div class="grow">
              <div class="suspense mb-1 h-5 w-20"></div>
              <div class="suspense h-6 w-full"></div>
            </div>
          </section>
          <section class="flex flex-row flex-wrap gap-4">
            <template v-for="i in 8" :key="i">
              <div class="suspense h-40 w-80 grow"></div>
            </template>
          </section>
        </section>
      </template>
    </Suspense>
  </main>
</template>

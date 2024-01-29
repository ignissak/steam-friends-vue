<script setup lang="ts">
import { useComparisonStore } from '@/stores/comparison';
import type { Game, User } from 'steam';

const comparisonStore = useComparisonStore();
comparisonStore.pastComparisons = comparisonStore.pastComparisons.sort(
  (a, b) => b.createdAt - a.createdAt
);

const formatDate = (date: number) => {
  const d = new Date(date);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
};

const calculateMatchRate = (
  numberOfTotalUsers: number,
  calculatedMatches: { game: Game; users: User[] }[]
) => {
  // each game inside calculatedMatches has a number of users that own that game
  // we need to calculate the match rate for each game and then average it out
  // to get the average match rate for the comparison
  const matchRates = calculatedMatches.map((game) => {
    const matchRate = game.users.length / numberOfTotalUsers;
    return matchRate;
  });

  const averageMatchRate = matchRates.reduce((acc, curr) => acc + curr, 0) / matchRates.length;

  return averageMatchRate * 100;
};
</script>

<template>
  <main class="container">
    <h2 class="mb-6">Your past comparisons</h2>
    <div class="flex flex-col gap-4">
      <template v-for="comparison in comparisonStore.pastComparisons" :key="comparison.id">
        <router-link
          :to="`/comparison/${comparison.id}`"
          class="card flex w-full gap-4 bg-neutral-950 p-4 transition-all hover:scale-105"
        >
          <header>
            <p class="text-xs text-neutral-700">{{ comparison.id }}</p>
            <h3 class="font-medium">{{ formatDate(comparison.createdAt) }}</h3>
          </header>
          <main>
            <p class="relative z-20 text-sm text-neutral-400">
              Total of {{ comparison.calculated.length }} games with average match rate of
              {{ calculateMatchRate(comparison.users.length, comparison.calculated).toFixed(2) }}%
            </p>
            <!-- Put this paragraph on the right side of the card -->
            <p
              class="absolute right-0 top-1/2 z-10 mr-4 hidden -translate-y-1/2 text-neutral-900 sm:block sm:text-4xl md:text-7xl"
            >
              {{ calculateMatchRate(comparison.users.length, comparison.calculated).toFixed(2) }}%
            </p>
          </main>
          <footer>
            <div class="flex flex-wrap items-center gap-1">
              <template v-for="user in comparison.users" :key="user.steamid">
                <div class="avatar tooltip" :data-tip="user.personaname">
                  <div class="w-6 rounded-full">
                    <img :src="user.avatarmedium" :alt="user.personaname" />
                  </div>
                </div>
              </template>
            </div>
          </footer>
        </router-link>
      </template>
    </div>
  </main>
</template>

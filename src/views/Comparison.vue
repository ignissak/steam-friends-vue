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
    <p class="text-neutral-700 text-xs">{{ comparison?.id }}</p>
    <div class="mb-6 flex flex-col gap-2 sm:flex-row sm:gap-4">
      <h2>Comparing libraries of {{ comparison?.users.length }} users</h2>
      <div class="avatar-group gap-1 rtl:space-x-reverse">
        <template v-for="friend in comparison?.users" :key="friend.steamid">
          <div class="avatar border-0">
            <div class="w-6">
              <img :src="friend.avatarfull" :alt="friend.personaname" />
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

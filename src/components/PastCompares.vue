<script setup lang="ts">
import { useComparisonStore } from '@/stores/comparison';
import { useRoute } from 'vue-router';

const comparisonStore = useComparisonStore();
const route = useRoute();
</script>

<template>
    <main class="container">
        <h2 class="mb-6">Your past comparisons</h2>
        <div class="flex flex-col gap-4">
            <template v-for="comparison in comparisonStore.pastComparisons" :key="comparison.id">
                <router-link :to="`/comparison/${comparison.id}`" class="btn btn-xs grow uppercase">
                    {{ comparison.id }}
                </router-link>
            </template>
        </div>
    </main>
</template>
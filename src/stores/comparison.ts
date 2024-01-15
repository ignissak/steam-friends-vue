import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useComparisonStore = defineStore(
  'comparison',
  () => {
    const pastComparison = ref({} as any);
  },
  {
    persist: true
  }
);

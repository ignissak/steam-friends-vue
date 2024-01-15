<script setup lang="ts">
import SelectableFriendList from '@/components/SelectableFriendList.vue';
</script>

<template>
  <Suspense>
    <template #default>
      <SelectableFriendList />
    </template>
  </Suspense>
</template>

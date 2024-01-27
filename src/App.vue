<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useUserStore } from './stores/user';
const userStore = useUserStore();
</script>

<template>
  <div class="flex h-screen flex-col">
    <header class="container mb-2 mt-6 flex flex-row items-center justify-between">
      <div>
        <h1>Steam Friends Library Compare</h1>
        <span class="text-sm text-neutral-700 block sm:inline">version 1.0.0</span>
      </div>
    </header>
    <template v-if="userStore.isLoggedIn">
      <nav class="container mb-6 flex flex-row items-center justify-between gap-4">
        <router-link to="/dashboard" class="btn btn-xs grow uppercase">Dashboard</router-link>
        <router-link to="/new" class="btn btn-xs grow uppercase">New comparison</router-link>
        <router-link to="/signout" class="btn btn-xs grow uppercase">Sign out</router-link>
      </nav>
    </template>

    <RouterView />
  </div>
</template>

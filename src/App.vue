<script setup lang="ts">
import { getCurrentInstance, provide } from 'vue';
import { RouterView } from 'vue-router';
import { useUserStore } from './stores/user';
const userStore = useUserStore();

const internalInstance = getCurrentInstance();
const progress: any = internalInstance!!.appContext.config.globalProperties.$Progress;

provide('progress', progress);

progress.start();
</script>

<template>
  <div class="flex h-screen flex-col">
    <header class="container mb-2 mt-6 flex flex-row items-center justify-between">
      <div>
        <h1>Steam Friends Library Compare</h1>
        <span class="block text-sm text-neutral-700 sm:inline">version 1.0.1</span>
      </div>
    </header>
    <template v-if="userStore.isLoggedIn">
      <nav class="container mb-6 flex flex-row items-center justify-between gap-2 sm:gap-4">
        <router-link to="/dashboard" class="btn btn-xs grow uppercase">Dashboard</router-link>
        <router-link to="/new" class="btn btn-xs grow uppercase">New comparison</router-link>
        <router-link to="/signout" class="btn btn-xs grow uppercase">Sign out</router-link>
      </nav>
    </template>

    <RouterView />
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<script setup lang="ts">
import { sort } from 'fast-sort';
import type { Comparison, Game, User } from 'steam';

const props = defineProps<{
  game: Game;
  comparison: Comparison;
  users: User[];
}>();

sort(props.users).asc((user) => user.personaname);

const headerImage = `https://cdn.akamai.steamstatic.com/steam/apps/${props.game.appid}/header.jpg`;
const storeLink = `https://store.steampowered.com/app/${props.game.appid}`;
</script>

<template>
  <div class="group card image-full grow bg-base-100 transition hover:scale-105 sm:w-80 max-h-52">
    <figure>
      <img
        :src="headerImage"
        class="grow opacity-25 transition-opacity group-hover:opacity-75"
        alt="Game picture"
      />
    </figure>
    <div class="card-body justify-between gap-4">
      <section>
        <div class="text-lg font-medium">
          <a :href="storeLink" target="_blank" class="link" v-if="game.name">{{
            game.name.trim()
          }}</a>
          <h2 class="" v-else><div class="suspense h-7 w-full"></div></h2>
        </div>
        <span v-if="users.length === comparison.users.length" class="text-neutral-400 text-sm"
          >All of you own this game!</span
        >
        <span v-else class="text-neutral-400 text-sm">{{ users.length }} of you owns this game!</span>
      </section>
      <section class="flex gap-1">
        <template v-for="user in users" :key="user.steamid">
          <div class="avatar tooltip first:tooltip-right first:sm:tooltip-top" :data-tip="user.personaname">
            <div class="w-6 rounded-full">
              <img :src="user.avatarfull" :alt="user.personaname" />
            </div></div
        ></template>
      </section>
    </div>
  </div>
</template>

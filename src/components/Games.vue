<script setup lang="ts">
import { sort } from 'fast-sort';
import type { Comparison, Game, User } from 'steam';
import { onMounted, ref, toRaw } from 'vue';
import GameCard from './GameCard.vue';

const props = defineProps<{
  comparison: Comparison;
}>();

const emit = defineEmits(['onGamesCalculated']);

const comparison = toRaw(props.comparison); // we don't need this to be reactive
const users = comparison.users;
const allGames: Record<string, Game[]> = {};
for (const user of users) {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/steam/${user.steamid}/games`, {
    credentials: 'include'
  });
  const json = await response.json();
  const games = json.data;
  allGames[user.steamid] = games;
}

// we want to find games that are in all users' libraries
// also we want to track how many users have a certain game
// map it as a dictionary where key is app id and value is an object containing count and game info
const gamesInCommon: Record<string, { game: Game; users: User[] }> = {};
for (const user of users) {
  for (const game of allGames[user.steamid]) {
    if (!game.appid) continue;
    if (gamesInCommon[game.appid]) {
      gamesInCommon[game.appid].users.push(user);
    } else {
      gamesInCommon[game.appid] = {
        users: [user],
        game
      };
    }
  }
}

// sort by count
const initialSortedGames = sort(Object.values(gamesInCommon)).desc((entry) => entry.users.length);
const sortedGames = ref(initialSortedGames);

// emit event to parent
emit('onGamesCalculated', sortedGames.value);

onMounted(async () => {
  // fetch every name that is missing for games
  const appIds = [];
  for (const entry of sortedGames.value) {
    if (entry.game.name) continue;
    appIds.push(entry.game.appid);
  }
  if (appIds.length === 0) return;
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/steam/games`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ appIds, liveData: true })
  });
  const json = await response.json();

  // update game names
  for (const entry of sortedGames.value) {
    if (entry.game.name) continue;
    if (json.data[entry.game.appid!!] && json.data[entry.game.appid!!].name) {
      entry.game.name = json.data[entry.game.appid!!].name;
    } else {
      entry.game.name = 'Unknown';
    }
  }
});

let nameFilter = '';
// TODO: User filter
let userFilter = ref([] as string[]);

const selectUser = async (user: User) => {
  let value = userFilter.value;
  if (value.includes(user.steamid)) {
    value = value.filter((entry) => entry !== user.steamid);
  } else {
    value.push(user.steamid);
  }
  userFilter.value = value;
  handleFilterChange();
};

const handleFilterChange = async () => {
  let value = sortedGames.value;
  if (nameFilter.length > 0) {
    console.debug('Filtering games', nameFilter);
    value = initialSortedGames.filter((entry) => {
      return entry.game.name?.toLowerCase().includes(nameFilter.toLowerCase());
    });
  } else {
    value = initialSortedGames;
  }
  if (nameFilter.length === 0) {
    console.debug('Sorting by initial count');
    value = initialSortedGames;
  } else {
    console.debug('Sorting by count');
    value = sort(value).desc((entry) => entry.users.length);
  }
  // filter with user filter, using for loop
  // only keep games that have all users in user filter
  if (userFilter.value.length > 0) {
    console.debug('Filtering games by user filter');
    const filteredGames = [];
    for (const entry of value) {
      let hasAllUsers = true;
      for (const user of userFilter.value) {
        if (!entry.users.find((entry) => entry.steamid === user)) {
          hasAllUsers = false;
          break;
        }
      }
      if (hasAllUsers) {
        filteredGames.push(entry);
      }
    }
    value = filteredGames;
  }
  sortedGames.value = value;
};

const reset = async () => {
  nameFilter = '';
  userFilter.value = [];
  handleFilterChange();
};

handleFilterChange();
</script>

<template>
  <section
    id="filters"
    class="mb-4 flex flex-col items-end justify-between gap-1 md:flex-row md:gap-4"
  >
    <div class="join w-full grow items-end">
      <label class="form-control join-item w-full">
        <div class="label">
          <span class="label-text">Game name</span>
        </div>
        <input
          type="text"
          v-model="nameFilter"
          placeholder="Type here"
          class="input input-bordered input-sm w-full"
          @input="handleFilterChange"
        />
      </label>
      <button
        @click="
          () => {
            nameFilter = '';
            handleFilterChange();
          }
        "
        class="btn btn-outline btn-primary join-item btn-sm"
        :disabled="nameFilter.length === 0"
      >
        Clear
      </button>
    </div>
    <div class="form-control w-full grow">
      <div class="label">
        <span class="label-text">Filter by user</span>
      </div>
      <div class="flex items-center justify-between gap-1">
        <template v-for="user in users" :key="user.steamid">
          <button class="avatar tooltip" :data-tip="user.personaname" @click="selectUser(user)">
            <div
              class="w-8 rounded-full transition-all hover:grayscale-0"
              :class="{
                'border-2 border-blue-400 grayscale-0': userFilter.includes(user.steamid),
                grayscale: !userFilter.includes(user.steamid)
              }"
            >
              <img :src="user.avatarfull" :alt="user.personaname" />
            </div>
          </button>
        </template>
      </div>
    </div>
    <button
      @click="reset"
      class="btn btn-outline btn-primary join-item btn-sm"
      :disabled="nameFilter.length === 0 && userFilter.length === 0"
    >
      Reset all
    </button>
  </section>

  <section class="mb-16 flex flex-row flex-wrap gap-4" id="games">
    <template v-for="entry in sortedGames" :key="entry.game.appid!!">
      <GameCard
        :game="entry.game"
        :users="entry.users"
        :comparison="props.comparison"
        :filtered-users="userFilter"
      />
    </template>
  </section>
</template>

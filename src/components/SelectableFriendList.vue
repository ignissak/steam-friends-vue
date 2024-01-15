<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { sort } from 'fast-sort';
import { ref } from 'vue';

const userStore = useUserStore();
await userStore.fetchFriends();

let friends = ref(userStore.friends);

let selectedFriends = ref([] as User[]);
let filter = '';
let sortBy = 'abc';

const handleFilterChange = async () => {
  let value = friends.value;
  if (filter.length > 0) {
    console.debug('Filtering friends');
    value = userStore.friends.filter((friend) => {
      return (
        friend.personaname.toLowerCase().includes(filter.toLowerCase()) ||
        friend.realname?.toLowerCase().includes(filter.toLowerCase())
      );
    });
  } else {
    value = userStore.friends;
  }
  if (sortBy === 'abc') {
    console.debug('Sorting alphabetically');
    value = sort(value).asc((friend) => friend.personaname);
  } else if (sortBy === 'online') {
    console.debug('Sorting by last online');
    value = sort(value).desc((friend) => friend.lastlogoff);
  }
  // sort if selected
  if (selectedFriends.value.length > 0) {
    console.debug('Sorting selected friends to top');
    value = sort(value).asc((friend) => {
      if (selectedFriends.value.includes(friend)) {
        return -1;
      } else {
        return 1;
      }
    });
  }
  friends.value = value;
};

const handleSelect = async (friend: User) => {
  if (selectedFriends.value.includes(friend)) {
    selectedFriends.value = selectedFriends.value.filter((f) => f !== friend);
  } else {
    selectedFriends.value.push(friend);
  }
  handleFilterChange();
};

handleFilterChange();

const reset = async () => {
  filter = '';
  sortBy = 'abc';
  selectedFriends.value = [];
  handleFilterChange();
};

const submit = async () => {};
</script>

<template>
  <main class="container">
    <h2 class="mb-4">Select friends you want to compare with</h2>
    <section id="filters" class="mb-4 flex flex-row items-end justify-between gap-4">
      <div class="join w-full grow items-end">
        <label class="form-control join-item w-full">
          <div class="label">
            <span class="label-text">Filter names</span>
          </div>
          <input
            type="text"
            v-model="filter"
            placeholder="Type here"
            class="input input-bordered input-sm w-full"
            @input="handleFilterChange"
          />
        </label>
        <button
          @click="
            () => {
              filter = '';
              handleFilterChange();
            }
          "
          class="btn btn-outline btn-primary join-item btn-sm"
          :disabled="filter.length === 0"
        >
          Clear
        </button>
      </div>
      <label class="form-control w-full grow">
        <div class="label">
          <span class="label-text">Sort by</span>
        </div>
        <select
          class="select select-bordered select-sm w-full"
          v-model="sortBy"
          @change="handleFilterChange"
        >
          <option value="abc">Alphabetically</option>
          <option value="online">Last online</option>
        </select>
      </label>
      <button class="btn btn-sm" @click="reset">Reset all</button>
    </section>

    <section class="mb-16 flex flex-row flex-wrap gap-4">
      <template v-for="friend in friends" :key="friend.steamid">
        <div
          class="indicator flex min-w-40 grow cursor-pointer flex-row items-center gap-3 rounded border border-neutral-900 p-2 text-left transition hover:bg-neutral-950"
          :class="{
            'bg-neutral-950': selectedFriends.includes(friend)
          }"
          @click="handleSelect(friend)"
        >
          <button
            :class="{
              hidden: !selectedFriends.includes(friend)
            }"
            class="badge indicator-item"
          >
            -
          </button>
          <!-- TODO: Remove from selection -->
          <div class="avatar">
            <div class="w-12 rounded">
              <img :src="friend.avatarfull" alt="" />
            </div>
          </div>
          <div class="select-none">
            <h2 class="text-sm text-neutral-100">{{ friend.personaname }}</h2>
            <p class="max-w-36 truncate text-xs text-gray-500">{{ friend.realname }}</p>
          </div>
        </div>
      </template>
    </section>
  </main>
  <transition-slide :offset="[0, 32]">
    <footer
      class="container btm-nav bg-transparent bg-gradient-to-t from-base-100 to-transparent"
      v-if="selectedFriends.length > 0"
    >
      <button class="btn" @click="submit">
        Continue with {{ selectedFriends.length }} friends selected →
      </button>
    </footer>
  </transition-slide>
</template>

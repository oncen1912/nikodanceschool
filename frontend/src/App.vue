<template>
  <!-- <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div> -->
  <!-- Include the tab navigation -->
  <TabsNavigation />

  <!-- Main content starts below navbar -->
  <main class="pt-5 mt-4"> <!-- pt-5 = padding-top for fixed navbar -->
    <div class="container py-4">
      <!-- Your existing tab content will appear here automatically -->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import TabsNavigation from './components/RouterTabsNavigation.vue'

const message = ref('');

const fetchData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/');
    message.value = response.data;
  } catch (error) {
    console.error(error);
  }
};
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

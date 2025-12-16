<template>

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
import TabsNavigation from './components/RouterTabsNavigation.vue'
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

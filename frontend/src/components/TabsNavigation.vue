<!-- frontend/src/components/TabsNavigation.vue -->
<template>
  <div>
    <!-- Bootstrap Tab Navigation -->
    <!-- <ul class="nav nav-pills mb-4 justify-content-center" id="myTab" role="tablist"> -->
    <ul class="nav nav-tabs mb-4" id="myTab" role="tablist">
      <li class="nav-item" role="presentation" v-for="(tab, index) in tabs" :key="index">
        <button class="nav-link" :class="{ active: activeTab === index }" :id="tab.id + '-tab'" data-bs-toggle="tab"
          :data-bs-target="'#' + tab.id" type="button" role="tab" @click="activeTab = index">
          <i :class="tab.icon" class="me-2"></i>
          {{ tab.title }}
        </button>
      </li>
    </ul>

    <!-- Tab Content -->
    <div class="tab-content" id="myTabContent">
      <div class="tab-pane fade" :class="{ 'show active': activeTab === index }" :id="tab.id" role="tabpanel"
        v-for="(tab, index) in tabs" :key="index">
        <component :is="tab.component" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'

// ==== YOUR TAB CONTENT COMPONENTS (create these later) ====
const HomeTab = defineAsyncComponent(() => import('./tabs/HomeTab.vue'))
const ProfileTab = defineAsyncComponent(() => import('./tabs/ProfileTab.vue'))
const SettingsTab = defineAsyncComponent(() => import('./tabs/SettingsTab.vue'))
const AboutTab = defineAsyncComponent(() => import('./tabs/AboutTab.vue'))

// ==== TAB CONFIGURATION ====
const tabs = ref([
  { id: 'home', title: 'Home', icon: 'bi bi-house-door-fill', component: HomeTab },
  { id: 'profile', title: 'Profile', icon: 'bi bi-person-circle', component: ProfileTab },
  { id: 'settings', title: 'Settings', icon: 'bi bi-gear-fill', component: SettingsTab },
  { id: 'about', title: 'About', icon: 'bi bi-info-circle-fill', component: AboutTab },
])

// Currently active tab (index)
const activeTab = ref(0)
</script>

<style scoped>
.nav-tabs .nav-link {
  color: #495057;
}

.nav-tabs .nav-link.active {
  color: #0d6efd;
  border-bottom: 3px solid #0d6efd;
}
</style>
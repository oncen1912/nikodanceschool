import { createRouter, createWebHistory } from 'vue-router';

// Lazy-load tab views (better performance)
const HomeTab = () => import('../components/tabs/HomeTab.vue')
const EventsTab = () => import('../components/tabs/EventsTab.vue')
const ProfileTab = () => import('../components/tabs/ProfileTab.vue')
const SettingsTab = () => import('../components/tabs/SettingsTab.vue')
const AboutTab = () => import('../components/tabs/AboutTab.vue')

// const routes = [
//   { path: '/', component: () => import('../components/Dashboard.vue') }
// ];
const routes = [
  { path: '/', redirect: '/home' },                    // default
  { path: '/home', name: 'home', component: HomeTab },
  { path: '/events', name: 'events', component: EventsTab },
  { path: '/profile', name: 'profile', component: ProfileTab },
  { path: '/settings', name: 'settings', component: SettingsTab },
  { path: '/about', name: 'about', component: AboutTab },

  // 404 fallback
  { path: '/:pathMatch(.*)*', redirect: '/home' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active',        // Bootstrap will use this class
  linkExactActiveClass: 'active'       // exact match also gets "active"
});

export default router;
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth'

// Lazy-load tab views (better performance)
const HomeTab = () => import('../components/tabs/HomeTab.vue')
const EventsTab = () => import('../components/tabs/EventsTab.vue')
const ProfileTab = () => import('../components/tabs/ProfileTab.vue')
const SettingsTab = () => import('../components/tabs/SettingsTab.vue')
const AboutTab = () => import('../components/tabs/AboutTab.vue')
const AuthLogin = () => import('../components/AuthLogin.vue')
const AuthRegister = () => import('../components/AuthRegister.vue')
const MyBookings = () => import('../views/MyBookings.vue')
const AdminDashboard = () => import('../views/AdminDashboard.vue')

const routes = [
  { path: '/', redirect: '/home' },                    // default
  { path: '/home', name: 'home', component: HomeTab },
  { path: '/events', name: 'events', component: EventsTab },
  { path: '/trainings', name: 'trainings', component: AboutTab },
  { path: '/profile', name: 'profile', component: ProfileTab },
  { path: '/settings', name: 'settings', component: SettingsTab },
  { path: '/about', name: 'about', component: AboutTab },

  { path: '/login', name: 'login', component: AuthLogin },
  { path: '/register', name: 'register', component: AuthRegister },

  { path: '/my-bookings', component: MyBookings, meta: { requiresAuth: true } },
  { path: '/admin', name: 'admin', component: AdminDashboard, meta: { requiresAuth: true, requiresAdmin: true } },

  // 404 fallback
  { path: '/:pathMatch(.*)*', redirect: '/home' }

]

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active',        // Bootstrap will use this class
  linkExactActiveClass: 'active'       // exact match also gets "active"
});

// Global guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Wait until the store has finished initializing
  if (authStore.loading) {
    await until(() => !authStore.loading)  // tiny helper, see below
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/home')
  } else {
    next()
  }
})

// Tiny helper to wait for a condition
function until(conditionFunction) {
  const poll = (resolve) => {
    if (conditionFunction()) resolve()
    else setTimeout(() => poll(resolve), 50)
  }
  return new Promise(poll)
}

export default router;
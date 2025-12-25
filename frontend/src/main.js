import { createApp } from 'vue'
import { createPinia } from 'pinia';
import './style.css'
import App from './App.vue'
import router from './router';
import { useAuthStore } from '@/stores/auth'
import { useEventsStore } from '@/stores/events'
import { useUsersStore } from '@/stores/users'
import { useArticlesStore } from '@/stores/articles'

// Bootstrap CSS & JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap'

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

// createApp(App).mount('#app')
const app = createApp(App);
app.use(createPinia());
app.use(router);

// CRITICAL: Wait for auth to be fully initialized BEFORE mounting the app
const authStore = useAuthStore()
await authStore.initAuth()   // ← this line fixes everything

const eventsStore = useEventsStore()
eventsStore.fetchEvents()           // initial load
eventsStore.enableRealtime()        // live updates forever

const usersStore = useUsersStore()
usersStore.fetchUsers()
usersStore.enableRealtime()

const articlesStore = useArticlesStore()
// Public pages: only published
if (!authStore.isAdmin) {
  articlesStore.fetchPublishedArticles()
} else {
  // Admin: load all articles (including drafts)
  articlesStore.fetchAllArticles()
}
articlesStore.enableRealtime()

app.use(Toast, { position: 'top-right' })
app.mount('#app');
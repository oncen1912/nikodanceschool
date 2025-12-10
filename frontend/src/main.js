import { createApp } from 'vue'
import { createPinia } from 'pinia';
import './style.css'
import App from './App.vue'
import router from './router';
import { useAuthStore } from '@/stores/auth'

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

app.use(Toast, { position: 'top-right' })
app.mount('#app');
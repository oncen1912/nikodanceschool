<!-- frontend/src/components/RouterTabsNavigation.vue -->
<template>
    <div class="sticky-top bg-white shadow-sm">
        <!-- Bootstrap Tabs using router-link -->
        <ul class="nav nav-tabs mb-4" id="routerTab" role="tablist">
            <li class="nav-item" role="presentation" v-for="tab in visibleTabs" :key="tab.path">
                <router-link :to="tab.path" class="nav-link d-flex align-items-center" active-class="active"
                    exact-active-class="active" role="tab">
                    <i :class="tab.icon" class="me-2"></i>
                    {{ tab.title }}
                </router-link>
            </li>

            <!-- Login/Logout in tabs (optional - or move to navbar) -->
            <li class="nav-item ms-auto" v-if="!authStore.isAuthenticated">
                <router-link to="/login" class="nav-link">
                    <i class="bi bi-box-arrow-in-right me-2"></i> Login
                </router-link>
            </li>
            <li class="nav-item ms-auto" v-else>
                <a class="nav-link" @click.prevent="authStore.signOut">
                    <i class="bi bi-box-arrow-left me-2"></i> Logout
                </a>
            </li>
        </ul>

    </div>

</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Base public tabs
const baseTabs = [
    { path: '/home', title: 'Home', icon: 'bi bi-house-door-fill' },
    { path: '/events', title: 'Events', icon: 'bi bi-calendar-event-fill' },
    { path: '/about', title: 'About', icon: 'bi bi-info-circle-fill' },
]

// Dynamic tabs based on login state
const visibleTabs = computed(() => {
    let tabs = [...baseTabs]

    if (authStore.isAuthenticated) {
        tabs.push({ path: '/my-bookings', title: 'My Bookings', icon: 'bi bi-bookmark-heart-fill' })
    }

    if (authStore.isAdmin) {
        tabs.push({ path: '/admin', title: 'Admin', icon: 'bi bi-speedometer2' })
    }

    return tabs
})
</script>

<style scoped>
/* Active state styling */
.nav-link {
    color: #495057;
    background-color: #f8f9fa;
    transition: all 0.3s ease;
}

.nav-link:hover {
    background-color: #e9ecef;
}

.nav-link.active {
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.25);
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Responsive adjustments */
@media (max-width: 576px) {
    .nav-link {
        font-size: 0.9rem;
    }
}
</style>
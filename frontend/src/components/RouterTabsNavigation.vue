<!-- frontend/src/components/RouterTabsNavigation.vue -->
<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm fixed-top">
        <div class="container">
            <!-- Brand / Logo -->
            <router-link class="navbar-brand fw-bold" to="/home">
                <i class="bi bi-rocket-takeoff me-2"></i>
                NDS
            </router-link>

            <!-- Toggler for mobile -->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- Navigation Tabs (converted to navbar links) -->
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto"> <!-- ms-auto = push to right -->
                    <li class="nav-item" v-for="tab in tabs" :key="tab.path">
                        <router-link :to="tab.path" class="nav-link d-flex align-items-center px-3"
                            active-class="active" exact-active-class="active">
                            <i :class="tab.icon" class="me-2"></i>
                            <span class="d-none d-lg-inline">{{ tab.title }}</span>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup>
const tabs = [
    { path: '/home', title: 'Home', icon: 'bi bi-house-door-fill' },
    { path: '/events', title: 'Events', icon: 'bi bi-calendar-event-fill' },
    { path: '/profile', title: 'Profile', icon: 'bi bi-person-circle' },
    { path: '/settings', title: 'Settings', icon: 'bi bi-gear-fill' },
    { path: '/about', title: 'About', icon: 'bi bi-info-circle-fill' },
]
</script>

<style scoped>
/* .nav-link {
    color: #495057;
    padding: 0.8rem 1.5rem;
} */

/* Active link style */
.nav-link.active {
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    font-weight: 600;
}

/* Smooth fade transition between tabs */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.navbar {
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
}
</style>
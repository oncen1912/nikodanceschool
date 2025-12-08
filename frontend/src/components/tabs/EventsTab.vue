<!-- frontend/src/components/tabs/EventsTab.vue -->
<template>
  <div>
    <h2 class="mb-4">
      <i class="bi bi-calendar-event-fill text-primary me-2"></i>
      Upcoming Events
    </h2>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Events Grid -->
    <div v-else class="row g-4">
      <div v-for="event in events" :key="event.id" class="col-md-6 col-lg-4">
        <div class="card h-100 shadow-sm border-0 hover-shadow">
          <div class="position-relative">
            <img :src="event.image" class="card-img-top" alt="Event image" style="height: 200px; object-fit: cover;" />
            <div class="position-absolute top-0 end-0 m-3 badge bg-primary fs-6">
              {{ event.date }}
            </div>
          </div>

          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ event.title }}</h5>
            <p class="card-text text-muted flex-grow-1">
              {{ event.description }}
            </p>

            <div class="d-flex align-items-center text-muted small mb-3">
              <i class="bi bi-geo-alt me-1"></i>
              {{ event.location }}
              <span class="mx-2">•</span>
              <i class="bi bi-clock me-1"></i>
              {{ event.time }}
            </div>

            <div class="mt-auto">
              <span class="badge me-2" :class="event.type === 'free' ? 'bg-success' : 'bg-warning'">
                {{ event.type === 'free' ? 'Free' : 'Paid' }}
              </span>
              <button class="btn btn-outline-primary btn-sm float-end">
                Register
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="!loading && events.length === 0" class="text-center py-5 text-muted">
      <i class="bi bi-calendar-x fs-1"></i>
      <p class="mt-3">No upcoming events at the moment.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Fake loading + mock data (replace later with real API call)
const loading = ref(true)
const events = ref([])

onMounted(() => {
  // Simulate API delay
  setTimeout(() => {
    events.value = [
      {
        id: 1,
        title: 'Vue.js Conference 2025',
        description: 'The biggest Vue gathering of the year with top speakers.',
        date: '15 Mar',
        time: '09:00 AM',
        location: 'San Francisco, CA',
        type: 'paid',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'
      },
      {
        id: 2,
        title: 'Free Bootstrap Workshop',
        description: 'Learn modern responsive design with Bootstrap 5.',
        date: '22 Mar',
        time: '02:00 PM',
        location: 'Online',
        type: 'free',
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80'
      },
      {
        id: 3,
        title: 'JavaScript Meetup',
        description: 'Networking, talks, and live coding sessions.',
        date: '5 Apr',
        time: '06:30 PM',
        location: 'New York, NY',
        type: 'free',
        image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80'
      },
      {
        id: 4,
        title: 'Node.js Performance Masterclass',
        description: 'Deep dive into performance optimization.',
        date: '10 May',
        time: '10:00 AM',
        location: 'Austin, TX',
        type: 'paid',
        image: 'https://images.unsplash.com/photo-1517142089942-94ab871d59e9?w=800&q=80'
      }
    ]
    loading.value = false
  }, 800)
})
</script>

<style scoped>
.hover-shadow:hover {
  transform: translateY(-4px);
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
}
</style>
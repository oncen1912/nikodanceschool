<!-- frontend/src/components/tabs/EventsTab.vue -->
<template>
  <div>
    <h2 class="mb-4">
      <i class="bi bi-calendar-event-fill text-primary me-2"></i>
      Upcoming Events
    </h2>

    <!-- Loading state -->
    <div v-if="eventsStore.loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Events Grid -->
    <div v-else class="row g-4">
      <div v-for="event in eventsStore.events" :key="event.id" class="col-md-2 col-lg-6">
        <!-- <div class="card h-100 shadow-sm border-0 hover-shadow"> -->
        <div class="card h-100 shadow-sm border-0 hover-shadow overflow-hidden">
          <div class="position-relative">
            <!-- <img :src="event.image" class="card-img-top" alt="Event image" style="height: 200px; object-fit: cover;" /> -->
            <img :src="event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'"
              class="card-img-top" alt="{{ event.title }} poster"
              style="height: 220px; width: 100%; object-fit: cover;" />
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
              <!-- <button class="btn btn-outline-primary btn-sm float-end">
                Register
              </button> -->
            </div>
            <div class="mt-auto d-flex justify-content-between align-items-center">
              <div>
                <span class="badge bg-secondary me-2">
                  {{ eventsStore.spotsLeft(event.id, event.capacity) }} spots left
                </span>
                <span v-if="eventsStore.isFullyBooked(event.id, event.capacity)" class="text-danger small">
                  Fully Booked
                </span>
              </div>

              <button class="btn btn-primary btn-sm" @click="bookEvent(event)"
                :disabled="!authStore.isAuthenticated || eventsStore.isFullyBooked(event.id, event.capacity)">
                {{ authStore.isAuthenticated ? 'Register' : 'Login to Register' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="!eventsStore.loading && eventsStore.events.length === 0" class="text-center py-5 text-muted">
      <i class="bi bi-calendar-x fs-1"></i>
      <p class="mt-3">No upcoming events at the moment.</p>
    </div>
  </div>
</template>

<script setup>
import { useEventsStore } from '@/stores/events'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase'

const eventsStore = useEventsStore()
const authStore = useAuthStore()
const router = useRouter()

// Booking logic
const bookEvent = async (event) => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  if (eventsStore.isFullyBooked(event.id, event.capacity)) {
    alert('This event is fully booked!')
    return
  }

  const { error } = await supabase
    .from('bookings')
    .insert({
      event_id: event.id,
      user_id: authStore.user.id
    })

  if (error) {
    if (error.code === '23505') {
      alert('You are already registered for this event!')
    } else {
      alert('Booking failed: ' + error.message)
    }
  } else {
    alert('Successfully registered! See you at the class 💃')
  }
}
</script>

<style scoped>
.hover-shadow:hover {
  transform: translateY(-4px);
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
}
</style>
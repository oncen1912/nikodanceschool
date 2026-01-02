<!-- frontend/src/components/tabs/EventsTab.vue -->
<template>
  <div class="container py-4">
    <h2 class="mb-4">
      <i class="bi bi-calendar-event-fill text-primary me-2"></i>
      Upcoming Events & Classes
    </h2>

    <!-- Loading -->
    <div v-if="eventsStore.loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-3 text-muted">Loading events...</p>
    </div>

    <!-- Events Grid -->
    <div v-else-if="eventsStore.events.length > 0" class="row g-4">
      <div v-for="event in eventsStore.events" :key="event.id" class="col-md-6 col-lg-6">
        <div class="card h-100 shadow-sm border-0 hover-shadow overflow-hidden">
          <div class="position-relative">
            <img :src="event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'"
              class="card-img-top" alt="Event poster" style="height: 220px; width: 100%; object-fit: cover;" />
            <div class="position-absolute top-0 start-0 m-3 badge bg-primary fs-6 px-3 py-2">
              {{ formatDate(event.date) }}
            </div>
          </div>

          <div class="card-body d-flex flex-column p-4">
            <h5 class="card-title mb-3 fw-bold text-primary" style="word-break: break-word;">
              {{ event.title }}
            </h5>

            <!-- <p class="card-text text-muted flex-grow-1 mb-4">
              {{ event.description || 'Join us for an exciting dance class!' }}
            </p> -->
            <div class="card-text text-muted flex-grow-1 mb-4" v-html="event.description"></div>

            <div class="d-flex align-items-center text-muted small mb-4">
              <i class="bi bi-geo-alt-fill me-2"></i>
              {{ event.location || 'Location TBD' }}
              <span class="mx-3">•</span>
              <i class="bi bi-clock-fill me-2"></i>
              {{ event.time || 'Time TBD' }}
            </div>

            <!-- Capacity + Registration Status -->
            <div class="mt-auto">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <!-- Spots Left -->
                <div>
                  <span class="badge bg-secondary fs-6 me-2">
                    {{ eventsStore.spotsLeft(event.id, event.capacity) }} / {{ event.capacity || 20 }} spots
                  </span>

                  <!-- User's status -->
                  <span v-if="isUserRegistered(event.id)" class="badge bg-success fs-6">
                    <i class="bi bi-check-circle me-1"></i> Registered
                  </span>
                  <span v-else-if="eventsStore.isFullyBooked(event.id, event.capacity)" class="badge bg-danger fs-6">
                    Fully Booked
                  </span>
                </div>
              </div>

              <!-- Register / Cancel Button -->
              <button class="btn w-100" :class="buttonClass(event.id, event.capacity)" @click="handleBooking(event)"
                :disabled="buttonDisabled(event.id, event.capacity)">
                {{ buttonText(event.id, event.capacity) }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="text-center py-5 text-muted">
      <i class="bi bi-calendar-x fs-1"></i>
      <h4>No upcoming events</h4>
      <p>Check back soon!</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useEventsStore } from '@/stores/events'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase'

const eventsStore = useEventsStore()
const authStore = useAuthStore()
const router = useRouter()

// Check if current user is registered for this event
const isUserRegistered = (eventId) => {
  if (!authStore.user) return false
  return eventsStore.bookings.some(
    b => b.event_id === eventId && b.user_id === authStore.user.id
  )
}

// Button logic
const buttonText = (eventId, capacity) => {
  if (!authStore.isAuthenticated) return 'Login to Register'
  if (isUserRegistered(eventId)) return 'Cancel Registration'
  if (eventsStore.isFullyBooked(eventId, capacity)) return 'Fully Booked'
  return 'Register Now'
}

const buttonClass = (eventId, capacity) => {
  if (isUserRegistered(eventId)) return 'btn-outline-danger'
  if (eventsStore.isFullyBooked(eventId, capacity)) return 'btn-secondary'
  return 'btn-primary'
}

const buttonDisabled = (eventId, capacity) => {
  return !authStore.isAuthenticated || eventsStore.isFullyBooked(eventId, capacity)
}

// Handle register or cancel
const handleBooking = async (event) => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  if (isUserRegistered(event.id)) {
    // Cancel booking
    if (!confirm('Cancel your registration for this event?')) return

    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('event_id', event.id)
      .eq('user_id', authStore.user.id)

    if (error) alert('Error cancelling: ' + error.message)
    else alert('Registration cancelled')
  } else {
    // Register
    const { error } = await supabase
      .from('bookings')
      .insert({
        event_id: event.id,
        user_id: authStore.user.id
      })

    if (error) {
      if (error.code === '23505') alert('You are already registered!')
      else alert('Error registering: ' + error.message)
    } else {
      alert('Successfully registered! See you there 💃')
    }
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'Date TBD'
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

onMounted(() => {
  if (eventsStore.events.length === 0 && !eventsStore.loading) {
    eventsStore.fetchEvents()
  }
})
</script>

<style scoped>
.hover-shadow:hover {
  transform: translateY(-8px);
  transition: all 0.3s ease;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
}

.card-img-top {
  transition: transform 0.4s ease;
}

.card:hover .card-img-top {
  transform: scale(1.05);
}
</style>
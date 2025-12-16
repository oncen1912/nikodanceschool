<template>
    <div class="container py-5">
        <h1 class="mb-4">My Bookings</h1>

        <div v-if="myEvents.length === 0" class="text-center py-5 text-muted">
            <i class="bi bi-calendar-x fs-1"></i>
            <p>No bookings yet. <router-link to="/events">Browse events</router-link></p>
        </div>

        <div v-else class="row g-4">
            <div v-for="event in myEvents" :key="event.id" class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h5>{{ event.title }}</h5>
                        <p class="text-muted">
                            {{ formatDate(event.date) }} at {{ event.time }}<br>
                            {{ event.location }}
                        </p>
                        <button @click="cancelBooking(event.id)" class="btn btn-outline-danger btn-sm">
                            Cancel Booking
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useEventsStore } from '@/stores/events'
import { useAuthStore } from '@/stores/auth'

const eventsStore = useEventsStore()
const authStore = useAuthStore()

const myEvents = computed(() => {
    const myBookingEventIds = eventsStore.bookings
        .filter(b => b.user_id === authStore.user?.id)
        .map(b => b.event_id)

    return eventsStore.events.filter(e => myBookingEventIds.includes(e.id))
})

const cancelBooking = async (eventId) => {
    if (!confirm('Cancel this booking?')) return

    await supabase
        .from('bookings')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', authStore.user.id)

    alert('Booking cancelled')
}

const formatDate = (date) => new Date(date).toLocaleDateString()
</script>
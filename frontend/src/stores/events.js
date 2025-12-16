// src/stores/events.js
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import { ref } from 'vue'

export const useEventsStore = defineStore('events', () => {
    const events = ref([])
    const loading = ref(false)
    // Add these refs
    const bookings = ref([])  // All bookings for capacity calculation

    const fetchEvents = async () => {
        loading.value = true
        const [{ data: eventsData }, { data: bookingsData }] = await Promise.all([
            supabase.from('events').select('*').order('date', { ascending: true }),
            supabase.from('bookings').select('*')
        ])

        events.value = eventsData || []
        bookings.value = bookingsData || []
        loading.value = false
    }

    // Computed: Spots left for each event
    const spotsLeft = (eventId, capacity = 20) => {
        const bookedCount = bookings.value.filter(b => b.event_id === eventId).length
        return Math.max(0, capacity - bookedCount)
    }

    const isFullyBooked = (eventId, capacity = 20) => spotsLeft(eventId, capacity) === 0

    // REALTIME MAGIC HERE
    const enableRealtime = () => {
        supabase
            .channel('public:events')
            .on(
                'postgres_changes',  // ← This is the "type" parameter
                {
                    event: '*',
                    schema: 'public',
                    table: 'events',
                }, (payload) => {
                    console.log('Realtime change received:', payload)  // Check this in console!

                    // Standard payload structure
                    const { eventType, new: newRecord, old: oldRecord } = payload

                    if (eventType === 'INSERT') {
                        events.value.push(newRecord)
                    } else if (eventType === 'UPDATE') {
                        const index = events.value.findIndex(e => e.id === newRecord.id)
                        if (index !== -1) {
                            events.value[index] = newRecord
                        }
                    } else if (eventType === 'DELETE') {
                        events.value = events.value.filter(e => e.id !== oldRecord.id)
                    }

                    // Keep sorted
                    events.value.sort((a, b) => new Date(a.date) - new Date(b.date))
                })
            .subscribe((status, err) => {
                console.log('Subscription status events:', status)
                if (err) console.error('Subscription error:', err)
            })

        supabase.channel('public:bookings')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, (payload) => {
                console.log('Booking change:', payload)

                if (payload.eventType === 'INSERT') {
                    bookings.value.push(payload.new)
                } else if (payload.eventType === 'DELETE') {
                    bookings.value = bookings.value.filter(b => b.id !== payload.old.id)
                }
            })
            .subscribe((status, err) => {
                console.log('Subscription status bookings:', status)
                if (err) console.error('Subscription error:', err)
            })
    }

    // Optional: Unsubscribe on app close (good practice)
    const disableRealtime = () => {
        supabase.removeAllChannels()
    }

    return {
        events,
        loading,
        fetchEvents,
        enableRealtime,
        disableRealtime,
        // booking helpers
        bookings,
        spotsLeft,
        isFullyBooked,
    }
})
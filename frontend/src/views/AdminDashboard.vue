<template>
    <div v-if="!loading">
        <h1 class="mb-4">
            <i class="bi bi-person-check-fill text-primary me-2"></i>
            Admin Dashboard
        </h1>

        <!-- Stats Cards (Dance School Style) -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="card text-white bg-primary">
                    <div class="card-body">
                        <h5>Total Events</h5>
                        <h2>{{ stats.totalEvents }}</h2>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-white bg-success">
                    <div class="card-body">
                        <h5>Active Students</h5>
                        <h2>{{ stats.totalUsers }}</h2>
                    </div>
                </div>
            </div>
            <!-- Add more: Upcoming Classes, Revenue, etc. -->
        </div>

        <!-- Events Management -->
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h3>Manage Events & Classes</h3>
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addEventModal">
                        <i class="bi bi-plus-circle me-2"></i>Add New Event
                    </button>
                </div>

                <!-- Events Table -->
                <div class="card">
                    <div class="card-body">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Date</th>
                                    <th>Location</th>
                                    <th>Type</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="event in events" :key="event.id">
                                    <td>{{ event.title }}</td>
                                    <td>{{ event.date }}</td>
                                    <td>{{ event.location }}</td>
                                    <td><span class="badge bg-secondary">{{ event.type }}</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary me-2">Edit</button>
                                        <button @click="deleteEvent(event.id)"
                                            class="btn btn-sm btn-outline-danger">Delete</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Event Modal -->
        <div class="modal fade" id="addEventModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <form @submit.prevent="addEvent">
                        <div class="modal-header">
                            <h5 class="modal-title">Add New Dance Event</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <input v-model="newEvent.title" placeholder="Title" class="form-control mb-2" required />
                            <input v-model="newEvent.description" placeholder="Description" class="form-control mb-2" />
                            <input v-model="newEvent.date" type="date" class="form-control mb-2" required />
                            <input v-model="newEvent.time" type="time" class="form-control mb-2" required />
                            <input v-model="newEvent.location" placeholder="Location" class="form-control mb-2"
                                required />
                            <select v-model="newEvent.type" class="form-select mb-2">
                                <option value="free">Free Class</option>
                                <option value="paid">Paid Workshop</option>
                                <option value="workshop">Special Workshop</option>
                            </select>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary">Save Event</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const { user, isAdmin, signOut } = useAuthStore()
const router = useRouter()
const loading = ref(true)
const events = ref([])
const stats = ref({ totalEvents: 0, totalUsers: 0 })
const newEvent = ref({ title: '', description: '', date: '', time: '', location: '', type: 'free' })

onMounted(async () => {
    if (!user || !isAdmin) {
        router.push('/login')
        return
    }

    // Fetch events
    const { data: eventsData } = await supabase.from('events').select('*').order('created_at', { ascending: false })
    events.value = eventsData || []

    // Fetch stats
    const { count: eventCount } = await supabase.from('events').select('*', { count: 'exact', head: true })
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
    stats.value = { totalEvents: eventCount, totalUsers: userCount }

    loading.value = false
})

const addEvent = async () => {
    const { data, error } = await supabase
        .from('events')
        .insert([{ ...newEvent.value, created_by: user.value.id }])
        .select()
    if (error) alert(error.message)
    else {
        events.value.push(data[0])
        newEvent.value = { title: '', description: '', date: '', time: '', location: '', type: 'free' }
        document.querySelector('#addEventModal .btn-close').click()
    }
}

const deleteEvent = async (id) => {
    if (confirm('Delete this event?')) {
        await supabase.from('events').delete().eq('id', id)
        events.value = events.value.filter(e => e.id !== id)
    }
}
</script>
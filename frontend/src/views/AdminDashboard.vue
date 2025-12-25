<!-- frontend/src/views/AdminDashboard.vue -->
<template>
    <div v-if="eventsStore.loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading events...</span>
        </div>
    </div>

    <div v-else class="container py-5">
        <h1 class="mb-5 display-5 fw-bold text-primary">
            <i class="bi bi-speedometer2 me-3"></i>
            Admin Dashboard
        </h1>

        <!-- Optional Stats (you can compute from eventsStore.events) -->
        <div class="row mb-5 g-4">
            <div class="col-md-4">
                <div class="card text-white bg-primary shadow">
                    <div class="card-body">
                        <h5>Total Events</h5>
                        <h2>{{ eventsStore.events.length }}</h2>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card text-white bg-success shadow">
                    <div class="card-body">
                        <h5>Upcoming</h5>
                        <h2>{{ upcomingCount }}</h2>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card text-white bg-info shadow">
                    <div class="card-body">
                        <h5>Users</h5>
                        <h2>{{ usersStore.users.length }}</h2>
                    </div>
                </div>
            </div>
        </div>

        <!-- Events Management -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="mb-0">Manage Events & Classes</h2>
            <button class="btn btn-primary btn-lg" data-bs-toggle="modal" data-bs-target="#eventModal"
                @click="openAddModal">
                <i class="bi bi-plus-circle me-2"></i>Add New Event
            </button>
        </div>

        <!-- Events Management -->
        <div class="card shadow">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>Title</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Location</th>
                                <th>Type</th>
                                <th class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="event in eventsStore.events" :key="event.id">
                                <td><strong>{{ event.title }}</strong></td>
                                <td>{{ formatDate(event.date) }}</td>
                                <td>{{ event.time || '-' }}</td>
                                <td>{{ event.location || '-' }}</td>
                                <td>
                                    <span class="badge" :class="getTypeBadgeClass(event.type)">
                                        {{ event.type ? event.type.charAt(0).toUpperCase() + event.type.slice(1) :
                                            'Event' }}
                                    </span>
                                </td>
                                <td class="text-end">
                                    <button class="btn btn-sm btn-outline-primary me-2" data-bs-toggle="modal"
                                        data-bs-target="#eventModal" @click="openEditModal(event)">
                                        <i class="bi bi-pencil"></i> Edit
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" @click="deleteEvent(event.id)">
                                        <i class="bi bi-trash"></i> Delete
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Modal for Add/Edit (same as before) -->
        <!-- Single Modal for Add & Edit -->
        <div class="modal fade" id="eventModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <form @submit.prevent="saveEvent">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                {{ isEditing ? 'Edit Event' : 'Add New Event' }}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row g-3">
                                <div class="col-md-8">
                                    <label class="form-label">Title <span class="text-danger">*</span></label>
                                    <input v-model="currentEvent.title" type="text" class="form-control" required />
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Type</label>
                                    <select v-model="currentEvent.type" class="form-select">
                                        <option value="free">Free</option>
                                        <option value="paid">Paid</option>
                                        <option value="workshop">Workshop</option>
                                    </select>
                                </div>

                                <div class="col-md-12">
                                    <label class="form-label">Description</label>
                                    <Editor v-model="currentEvent.description" licenseKey='gpl' :init="{
                                        height: 400,
                                        menubar: false,
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                                            'preview', 'anchor', 'searchreplace', 'visualblocks',
                                            'code', 'fullscreen', 'insertdatetime', 'media', 'table',
                                            'code', 'help', 'wordcount'
                                        ],
                                        toolbar:
                                            'undo redo | blocks | bold italic forecolor | ' +
                                            'alignleft aligncenter alignright alignjustify | ' +
                                            'bullist numlist outdent indent | link image | ' +
                                            'removeformat | code | help',
                                        content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; }'
                                    }" />
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label">Date <span class="text-danger">*</span></label>
                                    <input v-model="currentEvent.date" type="date" class="form-control" required />
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Time</label>
                                    <input v-model="currentEvent.time" type="time" class="form-control" />
                                </div>

                                <div class="col-md-8">
                                    <label class="form-label">Location</label>
                                    <input v-model="currentEvent.location" type="text" class="form-control" />
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Capacity</label>
                                    <input v-model.number="currentEvent.capacity" type="number" class="form-control"
                                        min="1" />
                                </div>

                                <div class="col-12">
                                    <label class="form-label">Image URL (optional)</label>
                                    <input v-model="currentEvent.image_url" type="url" class="form-control"
                                        placeholder="https://..." />
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-primary">
                                {{ isEditing ? 'Update Event' : 'Create Event' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Add this section after the Events Management table -->
        <div class="mt-5">
            <h2 class="mb-4">Bookings Overview</h2>

            <div class="card shadow">
                <div class="card-body">
                    <div v-if="eventsStore.loading" class="text-center py-4">
                        <div class="spinner-border text-primary"></div>
                    </div>

                    <div v-else>
                        <div v-for="event in eventsStore.events" :key="event.id" class="mb-4 pb-4 border-bottom">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h5 class="mb-0">
                                    <strong>{{ event.title }}</strong> <span class="badge text-bg-info">{{
                                        getBookingsForEvent(event.id).length }}</span>
                                    <span class="text-muted small ms-2">
                                        ({{ formatDate(event.date) }} • {{ event.location }})
                                    </span>
                                </h5>
                                <span class="badge bg-info fs-6">
                                    {{ eventsStore.spotsLeft(event.id, event.capacity) }} / {{ event.capacity || 20 }}
                                    spots
                                    left
                                </span>
                            </div>

                            <div v-if="getBookingsForEvent(event.id).length === 0" class="text-muted fst-italic">
                                No bookings yet.
                            </div>

                            <div v-else class="row g-3">
                                <div v-for="booking in getBookingsForEvent(event.id)" :key="booking.id"
                                    class="col-md-6 col-lg-4">
                                    <div class="d-flex align-items-center justify-content-between bg-light p-3 rounded">
                                        <div>
                                            <strong>{{ booking.user_email || 'User ' + booking.user_id.slice(0, 8)
                                            }}</strong><br>
                                            <small class="text-muted">Booked: {{ formatDateTime(booking.booked_at)
                                            }}</small>
                                        </div>
                                        <button @click="cancelBooking(booking.id, event.title)"
                                            class="btn btn-sm btn-outline-danger">
                                            <i class="bi bi-x-circle"></i> Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Articles Management Section -->
        <div class="mt-5">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="mb-0">Articles & News</h2>
                <button class="btn btn-success btn-lg" data-bs-toggle="modal" data-bs-target="#articleModal"
                    @click="openAddArticle">
                    <i class="bi bi-plus-circle me-2"></i>New Article
                </button>
            </div>

            <div class="card shadow">
                <div class="card-body p-0">
                    <div v-if="articlesStore.loading" class="text-center py-4">
                        <div class="spinner-border text-primary"></div>
                    </div>
                    <div v-else class="table-responsive">
                        <table class="table table-hover mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th>Title</th>
                                    <th>Published</th>
                                    <th>Date</th>
                                    <th class="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="article in articlesStore.articles" :key="article.id">
                                    <td>
                                        <strong>{{ article.title }}</strong>
                                        <small class="text-muted d-block">{{ article.excerpt || 'No excerpt' }}</small>
                                    </td>
                                    <td>
                                        <span class="badge"
                                            :class="article.is_published ? 'bg-success' : 'bg-secondary'">
                                            {{ article.is_published ? 'Published' : 'Draft' }}
                                        </span>
                                    </td>
                                    <td>{{ formatDate(article.published_at || article.created_at) }}</td>
                                    <td class="text-end">
                                        <button class="btn btn-sm btn-outline-primary me-2" data-bs-toggle="modal"
                                            data-bs-target="#articleModal" @click="openEditArticle(article)">
                                            <i class="bi bi-pencil"></i> Edit
                                        </button>
                                        <button class="btn btn-sm btn-outline-danger"
                                            @click="deleteArticle(article.id, article.title)">
                                            <i class="bi bi-trash"></i> Delete
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <!-- Article Modal -->
        <div class="modal fade" id="articleModal" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <form @submit.prevent="saveArticle">
                        <div class="modal-header">
                            <h5 class="modal-title">{{ isEditingArticle ? 'Edit Article' : 'New Article' }}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row g-3">
                                <div class="col-12">
                                    <label class="form-label">Title *</label>
                                    <input v-model="currentArticle.title" type="text" class="form-control" required />
                                </div>
                                <div class="col-12">
                                    <label class="form-label">Excerpt</label>
                                    <textarea v-model="currentArticle.excerpt" class="form-control" rows="3"></textarea>
                                </div>
                                <div class="col-12">
                                    <label class="form-label">Featured Image URL</label>
                                    <input v-model="currentArticle.image_url" type="url" class="form-control" />
                                </div>
                                <div class="col-12">
                                    <label class="form-label">Content *</label>
                                    <Editor v-model="currentArticle.content" licenseKey='gpl' :init="{
                                        height: 500,
                                        menubar: true,
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                                            'preview', 'anchor', 'searchreplace', 'visualblocks',
                                            'code', 'fullscreen', 'insertdatetime', 'media', 'table',
                                            'help', 'wordcount'
                                        ],
                                        toolbar:
                                            'undo redo | blocks | bold italic underline | ' +
                                            'alignleft aligncenter alignright alignjustify | ' +
                                            'bullist numlist outdent indent | link image media | ' +
                                            'removeformat | code | fullscreen | help',
                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
                                        // Self-hosted path
                                    }" />
                                </div>
                                <div class="col-12">
                                    <div class="form-check">
                                        <input v-model="currentArticle.is_published" class="form-check-input"
                                            type="checkbox" id="publish">
                                        <label class="form-check-label" for="publish">
                                            Publish immediately
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-primary">
                                {{ isEditingArticle ? 'Update' : 'Create' }} Article
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Users Management Section -->
        <div class="mt-5">
            <h2 class="mb-4">User Management ({{ usersStore.users.length }} total)</h2>

            <div class="card shadow">
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Joined</th>
                                    <!-- <th>Actions</th> -->
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="user in usersStore.users" :key="user.id">
                                    <td>
                                        <strong>{{ user.full_name || 'No name' }}</strong>
                                    </td>
                                    <td>{{ user.email }}</td>
                                    <td>
                                        <span class="badge"
                                            :class="user.role === 'admin' ? 'bg-danger' : 'bg-secondary'">
                                            {{ user.role || 'student' }}
                                        </span>
                                    </td>
                                    <td>{{ formatDate(user.created_at) }}</td>
                                    <!-- <td>
                                    <button class="btn btn-sm btn-outline-primary" disabled>
                                        Edit Role
                                    </button>
                                    </td> -->
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/supabase'
import { useEventsStore } from '@/stores/events'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useUsersStore } from '@/stores/users'
import { useArticlesStore } from '@/stores/articles'
import Editor from '@tinymce/tinymce-vue'

const router = useRouter()
const eventsStore = useEventsStore()
const authStore = useAuthStore()
const usersStore = useUsersStore()
const articlesStore = useArticlesStore()

const isEditing = ref(false)
const currentEvent = ref({
    id: null,
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'free',
    capacity: 20,
    image_url: ''
})

const upcomingCount = computed(() => {
    return eventsStore.events.filter(e => new Date(e.date) >= new Date()).length
})

const bookingCount = computed(() => {
    return eventsStore.bookings.length
})

onMounted(() => {
    if (!authStore.isAuthenticated || !authStore.isAdmin) {
        router.push('/login')
        return
    }

    // Async helper function (allowed inside non-async)
})

const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const getTypeBadgeClass = (type) => ({
    'bg-success': type === 'free',
    'bg-warning text-dark': type === 'paid',
    'bg-info': type === 'workshop'
})

const openAddModal = () => {
    isEditing.value = false
    currentEvent.value = { title: '', description: '', date: '', time: '', location: '', type: 'free', capacity: 20, image_url: '' }
}

const openEditModal = (event) => {
    isEditing.value = true
    currentEvent.value = { ...event }
}

const saveEvent = async () => {
    try {
        if (isEditing.value) {
            const { id, ...updateData } = currentEvent.value
            await supabase.from('events').update(updateData).eq('id', id)
        } else {
            await supabase.from('events').insert({
                ...currentEvent.value,
                created_by: authStore.user.id
            })
        }
        // No need to refetch — realtime will update eventsStore.events automatically!
        document.querySelector('#eventModal .btn-close').click()
    } catch (error) {
        alert('Error: ' + error.message)
    }
}

const deleteEvent = async (id) => {
    if (!confirm('Delete this event?')) return
    await supabase.from('events').delete().eq('id', id)
    // Realtime handles removal
}

// Get bookings for event (now uses cached emails)
const getBookingsForEvent = (eventId) => {
    return eventsStore.bookings
        .filter(b => b.event_id === eventId)
        .sort((a, b) => new Date(b.booked_at) - new Date(a.booked_at))
}

// Cancel booking
const cancelBooking = async (bookingId, eventTitle) => {
    if (!confirm(`Cancel booking for "${eventTitle}"?`)) return

    const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId)

    if (error) {
        alert('Error: ' + error.message)
    } else {
        alert('Booking cancelled successfully')
    }
}

// Articles Management
const isEditingArticle = ref(false)
const currentArticle = ref({
    id: null,
    title: '',
    excerpt: '',
    content: '<p></p>',
    image_url: '',
    is_published: false
})

const openAddArticle = () => {
    isEditingArticle.value = false
    currentArticle.value = {
        title: '',
        excerpt: '',
        content: '<p></p>',
        image_url: '',
        is_published: false
    }
}

const openEditArticle = (article) => {
    isEditingArticle.value = true
    currentArticle.value = { ...article }
}

const saveArticle = async () => {
    try {
        if (isEditingArticle.value) {
            const { id, ...data } = currentArticle.value
            await supabase.from('articles').update(data).eq('id', id)
        } else {
            await supabase.from('articles').insert({
                ...currentArticle.value,
                created_by: authStore.user.id
            })
        }
        document.querySelector('#articleModal .btn-close').click()
    } catch (err) {
        alert('Error: ' + err.message)
    }
}

const deleteArticle = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return
    await supabase.from('articles').delete().eq('id', id)
}

const formatDateTime = (isoString) => {
    return new Date(isoString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    })
}
</script>

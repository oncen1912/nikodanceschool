// frontend/src/stores/users.js
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import { ref } from 'vue'

export const useUsersStore = defineStore('users', () => {
    const users = ref([])
    const loading = ref(false)

    const fetchUsers = async () => {
        loading.value = true
        const { data, error } = await supabase
            .from('profiles')
            .select('id, email, full_name, role, created_at')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching users:', error)
            users.value = []
        } else {
            users.value = data || []
        }
        loading.value = false
    }

    // Realtime: new users appear instantly
    const enableRealtime = () => {
        supabase
            .channel('public:profiles')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    users.value.unshift(payload.new)
                } else if (payload.eventType === 'UPDATE') {
                    const index = users.value.findIndex(u => u.id === payload.new.id)
                    if (index !== -1) users.value[index] = payload.new
                } else if (payload.eventType === 'DELETE') {
                    users.value = users.value.filter(u => u.id !== payload.old.id)
                }
            })
            .subscribe()
    }

    return {
        users,
        loading,
        fetchUsers,
        enableRealtime,
    }
})
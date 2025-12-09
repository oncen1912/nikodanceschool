import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)

    // Check session on app start
    supabase.auth.getSession().then(({ data }) => {
        user.value = data.session?.user ?? null
    })

    // Listen to auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
        user.value = session?.user ?? null
    })

    const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password })
    const signUp = (email, password) => supabase.auth.signUp({ email, password })
    const signOut = () => supabase.auth.signOut()
    const signInWithGoogle = () => supabase.auth.signInWithOAuth({ provider: 'google' })

    return { user, signIn, signUp, signOut, signInWithGoogle }
})
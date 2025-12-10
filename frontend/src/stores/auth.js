// frontend/src/stores/auth.js
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const profile = ref(null)
  const loading = ref(true)          // ← NEW: know when we're ready

  // 1. On store creation: restore session immediately
  const initAuth = async () => {
    loading.value = true

    const { data: { session } } = await supabase.auth.getSession()
    user.value = session?.user ?? null

    if (user.value) {
      await fetchProfile()
    }

    loading.value = false

    // 2. Listen to ALL future auth changes (login, logout, token refresh)
    supabase.auth.onAuthStateChange(async (_event, session) => {
      user.value = session?.user ?? null
      profile.value = null

      if (user.value) {
        await fetchProfile()
      }
    })
  }

  // Call it immediately when store is created
  // initAuth()

  // Fetch profile + role
  const fetchProfile = async () => {
    if (!user.value) return

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .single()

    if (!error && data) {
      profile.value = data
    }
  }

  // Auth actions
  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    })
    if (error) throw error
    return data
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  const signInWithGoogle = () => {
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    user.value = null
    profile.value = null
  }

  // Computed
  const isAdmin = computed(() => profile.value?.role === 'admin')
  const isAuthenticated = computed(() => !!user.value)
  const isLoading = computed(() => loading.value)

  return {
    user,
    profile,
    loading: isLoading,
    isAuthenticated,
    isAdmin,

    initAuth,        // ← exported
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    fetchProfile,
  }
})
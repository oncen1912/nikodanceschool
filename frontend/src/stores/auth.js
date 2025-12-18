// frontend/src/stores/auth.js
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const profile = ref(null)
  const loading = ref(true)
  const userCount = ref(0)

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

    // count users...
    const { count, error } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
    if (error) throw error
    userCount.value = count || 0
  }

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

    initAuth,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    fetchProfile,
    userCount: userCount
  }
})
// src/stores/articles.js
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import { ref } from 'vue'

export const useArticlesStore = defineStore('articles', () => {
  const articles = ref([])
  const loading = ref(false)

// Public fetch: only published articles (for NewsTab)
  const fetchPublishedArticles = async () => {
    loading.value = true
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, excerpt, image_url, published_at, content')
      .eq('is_published', true)
      .order('published_at', { ascending: false })

    if (error) console.error('Error fetching published articles:', error)
    else articles.value = data || []

    loading.value = false
  }

  // ADMIN ONLY: fetch ALL articles (published + drafts)
  const fetchAllArticles = async () => {
    loading.value = true
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false, nullsLast: true })

    if (error) {
      console.error('Error fetching all articles:', error)
      articles.value = []
    } else {
      articles.value = data || []
    }
    loading.value = false
  }

// Realtime: listen to all changes (admin sees everything)
  const enableRealtime = () => {
    supabase
      .channel('admin:articles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'articles' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          articles.value.unshift(payload.new)
        } else if (payload.eventType === 'UPDATE') {
          const index = articles.value.findIndex(a => a.id === payload.new.id)
          if (index !== -1) {
            articles.value[index] = payload.new
          } else {
            articles.value.unshift(payload.new) // e.g., newly published
          }
        } else if (payload.eventType === 'DELETE') {
          articles.value = articles.value.filter(a => a.id !== payload.old.id)
        }
      })
      .subscribe()
  }

  return {
    articles,
    loading,
    fetchPublishedArticles,
    fetchAllArticles,
    enableRealtime,
  }
})
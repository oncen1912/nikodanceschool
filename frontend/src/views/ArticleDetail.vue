<!-- frontend/src/views/ArticleDetail.vue -->
<template>
  <div class="article-detail py-5">
    <div class="container">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading article...</span>
        </div>
      </div>

      <!-- Not Found -->
      <div v-else-if="!article" class="text-center py-5">
        <i class="bi bi-journal-x fs-1 text-muted"></i>
        <h3 class="mt-3 text-muted">Article not found</h3>
        <router-link to="/news" class="btn btn-primary mt-4">Back to News</router-link>
      </div>

      <!-- Article Content -->
      <div v-else>
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <!-- Image -->
            <div class="mb-4 rounded overflow-hidden shadow-sm">
              <img
                :src="article.image_url || 'https://placehold.co/1200x600?text=Niko+Dance+School'"
                class="img-fluid w-100"
                alt="Article cover"
                style="max-height: 500px; object-fit: cover;"
              />
            </div>

            <!-- Title & Meta -->
            <h1 class="display-4 fw-bold mb-3">{{ article.title }}</h1>
            <div class="text-muted mb-5 d-flex align-items-center justify-content-between flex-wrap gap-3">
              <span>
                <i class="bi bi-calendar-event me-2"></i>
                {{ formatDate(article.published_at) }}
              </span>
              <router-link to="/news" class="text-primary">
                ← Back to News
              </router-link>
            </div>

            <!-- Rich Content -->
            <div class="article-content" v-html="article.content"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useArticlesStore } from '@/stores/articles'

const route = useRoute()
const articlesStore = useArticlesStore()

const loading = ref(true)
const article = computed(() => {
  return articlesStore.articles.find(a => a.id === route.params.id)
})

onMounted(async () => {
  // Ensure data is loaded
  if (articlesStore.articles.length === 0) {
    await articlesStore.fetchPublishedArticles()
  }
  loading.value = false
})

const formatDate = (iso) => {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.article-content {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #333;
}

.article-content :deep(h2),
.article-content :deep(h3) {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.article-content :deep(p) {
  margin-bottom: 1.5rem;
}

.article-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1.5rem 0;
}

.article-content :deep(ul),
.article-content :deep(ol) {
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
}

.article-content :deep(li) {
  margin-bottom: 0.5rem;
}

.article-content :deep(a) {
  color: #0d6efd;
  text-decoration: underline;
}
</style>
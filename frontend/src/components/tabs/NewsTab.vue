<!-- frontend/src/components/tabs/NewsTab.vue -->
<template>
    <div>
        <h2 class="mb-5 text-center display-5 fw-bold">
            <i class="bi bi-newspaper text-primary me-3"></i>
            Latest News & Updates
        </h2>

        <!-- Loading -->
        <div v-if="articlesStore.loading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
        </div>

        <!-- Articles Grid -->
        <div v-else-if="articlesStore.articles.length > 0" class="row g-4">
            <div v-for="article in articlesStore.articles" :key="article.id" class="col-md-6 col-lg-4">
                <div class="card h-100 shadow-sm border-0 hover-shadow">
                    <img :src="article.image_url || 'https://placehold.co/800x500?text=Niko Dance School'"
                        class="card-img-top" alt="Article image" style="height: 220px; object-fit: cover;" />
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title fw-bold">{{ article.title }}</h5>
                        <p class="card-text text-muted flex-grow-1">
                            {{ article.excerpt || 'Read the latest from NikoDance School' }}
                        </p>
                        <div class="mt-auto d-flex justify-content-between align-items-center text-muted small">
                            <span><i class="bi bi-calendar"></i> {{ formatDate(article.published_at) }}</span>
                            <router-link :to="{ name: 'article-detail', params: { id: article.id } }"
                                class="stretched-link text-primary fw-medium">
                                Read More →
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty -->
        <div v-else class="text-center py-5 text-muted">
            <i class="bi bi-journal-text fs-1"></i>
            <h4>No articles yet</h4>
            <p>Check back soon!</p>
        </div>
    </div>
</template>

<script setup>
import { useArticlesStore } from '@/stores/articles'

const articlesStore = useArticlesStore()

const formatDate = (iso) => {
    return new Date(iso).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    })
}
</script>

<style scoped>
.hover-shadow:hover {
    transform: translateY(-8px);
    transition: all 0.3s ease;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
}
</style>
<!-- frontend/src/components/tabs/HomeTab.vue -->
<template>
  <div class="hero-section position-relative overflow-hidden">
    <!-- Video Background -->
    <video class="video-bg" autoplay muted loop playsinline poster="/images/niko.png">
      <source src="/videos/niko.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>

    <!-- Dark Overlay for Text Readability -->
    <div class="overlay"></div>

    <!-- Hero Content -->
    <div class="container h-100 position-relative d-flex align-items-center justify-content-center text-center">
      <div class="hero-content text-white">
        <h1 class="display-3 fw-bold mb-4">
          Discover the Joy of Dance
        </h1>
        <p class="lead mb-5 fs-3">
          Join our vibrant community at Niko Dance School
        </p>
        <router-link to="/events" class="btn btn-primary btn-lg px-5 py-3">
          View Classes & Events
        </router-link>
      </div>
    </div>
  </div>

</template>

<script setup>
// No script needed for basic video
</script>

<style scoped>
.hero-section {
  position: relative;
  height: 100vh;
  min-height: 600px;
  overflow: hidden;
}

.video-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: translate(-50%, -50%);
  /* Better centering than top/left 0 */
  z-index: 1;
  /* Now above background, below content */
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  /* Dark overlay for text */
  z-index: 2;
}

.hero-content {
  position: relative;
  z-index: 3;
  /* Text on top */
  color: white;
}

/* Mobile fallback: Hide video on small screens to save data */
@media (max-width: 768px) {
  .video-bg {
    display: none;
  }

  .hero-section {
    background: url('/images/niko.png') center/cover no-repeat;
  }
}
</style>
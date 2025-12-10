<template>
  <div class="row justify-content-center mt-5">
    <div class="col-md-6">
      <div class="card shadow">
        <div class="card-body p-4">
          <h2 class="text-center mb-4">Welcome Back to Niko Dance School</h2>
          <form @submit.prevent="login">
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="email" type="email" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input v-model="password" type="password" class="form-control" required />
            </div>
            <button type="submit" class="btn btn-primary w-100 mb-3">Login</button>
            <button @click="googleLogin" class="btn btn-outline-danger w-100">
              <i class="bi bi-google me-2"></i>Continue with Google
            </button>
            <p class="text-center mt-3">
              New student? <router-link to="/register">Register here</router-link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const { signIn, signInWithGoogle } = useAuthStore()
const router = useRouter()
const toast = useToast()

const email = ref(''), password = ref('')

const login = async () => {
  try {
    await signIn(email.value, password.value)
    router.push('/admin') // Redirect to admin dashboard
  } catch (error) {
    toast.error(error.message)
  }
}

const googleLogin = async () => await signInWithGoogle()
</script>
<template>
  <div class="row justify-content-center mt-5">
    <div class="col-md-6">
      <div class="card shadow">
        <div class="card-body p-4">
          <h2 class="text-center mb-4">Join Niko Dance School</h2>
          <form @submit.prevent="register">
            <div class="mb-3">
              <label class="form-label">Full Name</label>
              <input v-model="fullName" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="email" type="email" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input v-model="password" type="password" class="form-control" required minlength="6" />
            </div>
            <button type="submit" class="btn btn-primary w-100 mb-3">Register</button>
            <button @click="googleRegister" class="btn btn-outline-danger w-100">
              <i class="bi bi-google me-2"></i>Sign up with Google
            </button>
            <p class="text-center mt-3">
              Already have an account? <router-link to="/login">Login here</router-link>
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
import { useToast } from 'vue-toastification' // npm install vue-toastification

const { signUp, signInWithGoogle } = useAuthStore()
const router = useRouter()
const toast = useToast()

const fullName = ref(''), email = ref(''), password = ref('')

const register = async () => {
  try {
    await signUp(email.value, password.value, fullName.value)
    toast.success('Registration successful! Please check your email.')
    router.push('/login')
  } catch (error) {
    toast.error(error.message)
  }
}

const googleRegister = async () => {
  await signInWithGoogle()
  // After Google, redirect to dashboard if success
}
</script>
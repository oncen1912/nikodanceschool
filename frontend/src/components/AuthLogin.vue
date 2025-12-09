<template>
  <div class="card mx-auto mt-5" style="max-width: 400px;">
    <div class="card-body">
      <h3 class="text-center mb-4">Welcome Back</h3>
      <form @submit.prevent="login">
        <input v-model="email" type="email" class="form-control mb-3" placeholder="Email" required />
        <input v-model="password" type="password" class="form-control mb-3" placeholder="Password" required />
        <button type="submit" class="btn btn-primary w-100">Login</button>
      </form>
      <hr>
      <button @click="googleLogin" class="btn btn-outline-danger w-100">
        Continue with Google
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const { signIn, signInWithGoogle } = useAuthStore()
const router = useRouter()

const login = async () => {
  const { error } = await signIn(email.value, password.value)
  if (!error) router.push('/admin')
}
const googleLogin = async () => {
  await signInWithGoogle()
}
</script>
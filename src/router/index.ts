import LoginView from '@/views/auth/LoginView.vue'
import PasswordReset from '@/views/auth/PasswordReset.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import LandingView from '@/views/landing/LandingView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      name: 'register',
      path: '/register',
      component: RegisterView,
    },
    {
      name: 'resetPassword',
      path: '/reset-password',
      component: PasswordReset,
    },
  ],
})

export default router

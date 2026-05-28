import LoginView from '@/views/auth/LoginView.vue'

import RegisterView from '@/views/auth/RegisterView.vue'
import LandingView from '@/views/landing/LandingView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import VerifyOtpView from '@/views/auth/VerifyOtpView.vue'
import ForgotPasswordView from '@/views/auth/ForgotPasswordView.vue'
import ResetPasswordView from '@/views/auth/ResetPasswordView.vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'
import ScreeningView from '@/views/screening/ScreeningView.vue'
import ProfileView from '@/views/profile/ProfileView.vue'
import CourseListView from '@/views/course/CourseListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView,
      meta: { transition: 'fade' },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { transition: 'slide-left' },
    },
    {
      name: 'register',
      path: '/register',
      component: RegisterView,
      meta: { transition: 'slide-right' },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordView,
      meta: { requiresGuest: true },
    },
    {
      path: '/verify-otp',
      name: 'verify-otp',
      component: VerifyOtpView,
      meta: { requiresGuest: true },
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: ResetPasswordView,
      meta: { requiresGuest: true },
    },
    {
      path: '/course',
      name: 'course',
      component: CourseListView,
      meta: { requiresAuth: true },
    },
    {
      path: '/screening/:childId/:type',
      name: 'screening',
      component: ScreeningView,
      // meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
  ],
})

export default router

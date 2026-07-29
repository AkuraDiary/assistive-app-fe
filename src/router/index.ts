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
import CourseDetailView from '@/views/course/CourseDetailView.vue'
import MateriView from '@/views/course/MateriView.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

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
      path: '/screening/:childId/:type',
      name: 'screening',
      component: ScreeningView,
      meta: { requiresAuth: true },
    },
    {
      path: '/app',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: DashboardView,
        },
        {
          path: '/course',
          name: 'course',
          component: CourseListView,
        },
        {
          path: '/profile',
          name: 'profile',
          component: ProfileView,
        },
        // Placeholder routes for other roles
        { path: '/pendaftaran', name: 'pendaftaran', component: () => import('@/views/dashboard/roles/PlaceholderView.vue') },
        { path: '/siswa', name: 'siswa', component: () => import('@/views/dashboard/roles/PlaceholderView.vue') },
        { path: '/guru', name: 'guru', component: () => import('@/views/dashboard/roles/PlaceholderView.vue') },
        { path: '/lembaga', name: 'lembaga', component: () => import('@/views/dashboard/roles/PlaceholderView.vue') },
        { path: '/paket-penjualan', name: 'paket-penjualan', component: () => import('@/views/dashboard/roles/PlaceholderView.vue') },
        { path: '/manajemen-pengguna', name: 'manajemen-pengguna', component: () => import('@/views/dashboard/roles/PlaceholderView.vue') },
        {
          path: '/course/:courseId/latihan/:latihanId/materi',
          name: 'materi',
          component: MateriView,
        },
        {
          path: '/course/:courseId',
          name: 'course-detail',
          component: CourseDetailView,
        },
      ]
    }
  ],
})

export default router

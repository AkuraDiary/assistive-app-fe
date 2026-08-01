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
import ModulFormView from '@/views/course/ModulFormView.vue'
import MateriView from '@/views/course/MateriView.vue'
import MateriEditorView from '@/views/course/MateriEditorView.vue'
import AssessmentEditorView from '@/views/course/AssessmentEditorView.vue'
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
        { path: '/pendaftaran', name: 'pendaftaran', component: () => import('@/views/dashboard/roles/PendaftaranView.vue') },
        { path: '/siswa', name: 'siswa', component: () => import('@/views/dashboard/roles/SiswaView.vue') },
        { path: '/guru', name: 'guru', component: () => import('@/views/dashboard/roles/GuruView.vue') },
        { path: '/guru/create', name: 'guru-create', component: () => import('@/views/dashboard/roles/GuruFormView.vue') },
        { path: '/guru/:id/edit', name: 'guru-edit', component: () => import('@/views/dashboard/roles/GuruFormView.vue') },
        { path: '/guru/:id', name: 'guru-detail', component: () => import('@/views/dashboard/roles/GuruDetailView.vue') },
        { path: '/lembaga', name: 'lembaga', component: () => import('@/views/dashboard/roles/LembagaListView.vue') },
        { path: '/lembaga/create', name: 'lembaga-create', component: () => import('@/views/dashboard/roles/LembagaFormView.vue') },
        { path: '/lembaga/:id/edit', name: 'lembaga-edit', component: () => import('@/views/dashboard/roles/LembagaFormView.vue') },
        { path: '/lembaga/:id', name: 'lembaga-detail', component: () => import('@/views/dashboard/roles/LembagaDetailView.vue') },
        { path: '/paket-penjualan', name: 'paket-penjualan', component: () => import('@/views/dashboard/roles/PlaceholderView.vue') },
        { path: '/manajemen-pengguna', name: 'manajemen-pengguna', redirect: '/manajemen-pengguna/roles' },
        { path: '/manajemen-pengguna/roles', name: 'roles', component: () => import('@/views/dashboard/roles/RoleListView.vue') },
        { path: '/manajemen-pengguna/roles/create', name: 'roles-create', component: () => import('@/views/dashboard/roles/RoleFormView.vue') },
        { path: '/manajemen-pengguna/roles/:id/edit', name: 'roles-edit', component: () => import('@/views/dashboard/roles/RoleFormView.vue') },
        { path: '/manajemen-pengguna/roles/:id', name: 'roles-detail', component: () => import('@/views/dashboard/roles/RoleDetailView.vue') },
        { path: '/manajemen-pengguna/users', name: 'users', component: () => import('@/views/dashboard/roles/UserListView.vue') },
        { path: '/manajemen-pengguna/users/create', name: 'users-create', component: () => import('@/views/dashboard/roles/UserFormView.vue') },
        { path: '/manajemen-pengguna/users/:id/edit', name: 'users-edit', component: () => import('@/views/dashboard/roles/UserFormView.vue') },
        { path: '/manajemen-pengguna/users/:id', name: 'users-detail', component: () => import('@/views/dashboard/roles/UserDetailView.vue') },
        {
          path: '/course/:courseId/latihan/:latihanId/materi',
          name: 'materi',
          component: MateriView,
        },
        {
          path: '/course/:courseId/tambah-modul',
          name: 'tambah-modul',
          component: ModulFormView,
        },
        {
          path: '/course/:courseId/materi/:moduleId/edit',
          name: 'materi-edit',
          component: MateriEditorView,
        },
        {
          path: '/course/:courseId/assessment/:moduleId/edit',
          name: 'assessment-edit',
          component: AssessmentEditorView,
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

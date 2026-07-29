<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '@/composable/useAuth'
import ParentDashboard from './roles/ParentDashboard.vue'
import TeacherDashboard from './roles/TeacherDashboard.vue'
import InstitutionDashboard from './roles/InstitutionDashboard.vue'
import AdminDashboard from './roles/AdminDashboard.vue'

const { user } = useAuth()
const role = computed(() => user.value?.role || 'parent')

const currentDashboard = computed(() => {
  if (role.value === 'admin') return AdminDashboard
  if (role.value === 'institution') return InstitutionDashboard
  if (role.value === 'teacher') return TeacherDashboard
  return ParentDashboard
})
</script>

<template>
  <component :is="currentDashboard" />
</template>

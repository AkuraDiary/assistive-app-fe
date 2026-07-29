<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '@/composable/useAuth'
import ParentDashboard from './roles/ParentDashboard.vue'
import PlaceholderView from './roles/PlaceholderView.vue'

const { user } = useAuth()
const role = computed(() => user.value?.role || 'parent')

const currentDashboard = computed(() => {
  if (role.value === 'admin') return PlaceholderView
  if (role.value === 'institution') return PlaceholderView
  if (role.value === 'teacher') return PlaceholderView
  return ParentDashboard
})
</script>

<template>
  <component :is="currentDashboard" />
</template>

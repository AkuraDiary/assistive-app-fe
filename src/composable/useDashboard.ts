import { ref, computed, watch } from 'vue'
import type { DashboardState, Child } from '@/types/dashboard.types'
import { dashboardService } from '@/services/dashboard.service'

const state = ref<DashboardState>({
  user: null,
  children: [],
  selectedChildId: null,
  courses: [],
  activities: [],
  loading: false,
  error: null,
})

export function useDashboard() {
  const hasChildren = computed(() => state.value.children.length > 0)
  const selectedChild = computed(
    () => state.value.children.find((c) => c.id === state.value.selectedChildId) ?? null,
  )

  async function initialize() {
    state.value.loading = true
    state.value.error = null
    try {
      const [user, children] = await Promise.all([
        dashboardService.getUser(),
        dashboardService.getChildren(),
      ])
      state.value.user = user
      state.value.children = children
      const selectedChild = computed<Child | null>(() => {
        if (!state.value.children) return null
        return state.value.children.find((c) => c.id === state.value.selectedChildId) ?? null
      })
      //   state.value.selectedChildId = selectChild;
      //   if (children.length > 0) state.value.selectedChildId = children[0].id
    } catch (err) {
      state.value.error = (err as Error).message
    } finally {
      state.value.loading = false
    }
  }

  async function selectChild(id: string) {
    state.value.selectedChildId = id
  }

  async function addChild(name: string) {
    const child = await dashboardService.addChild(name)
    state.value.children.push(child)
    state.value.selectedChildId = child.id
    return child
  }

  async function loadChildData(childId: string) {
    state.value.loading = true
    try {
      const [courses, activities] = await Promise.all([
        dashboardService.getCourses(childId),
        dashboardService.getActivities(childId),
      ])
      state.value.courses = courses
      state.value.activities = activities
    } catch (err) {
      state.value.error = (err as Error).message
    } finally {
      state.value.loading = false
    }
  }

  watch(
    () => state.value.selectedChildId,
    (id) => {
      if (id) loadChildData(id)
    },
    { immediate: true },
  )

  return {
    state,
    hasChildren,
    selectedChild,
    initialize,
    selectChild,
    addChild,
    loadChildData,
  }
}

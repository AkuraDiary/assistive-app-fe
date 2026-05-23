import { ref, computed, watch } from 'vue'
import type {
  DashboardState,
  Child,
  AddChildPayload,
  ScreeningUIState,
} from '@/types/dashboard.types'
import { dashboardService } from '@/services/dashboard.service'

const state = ref<DashboardState>({
  user: null,
  children: [],
  childRecords: [],
  selectedChildId: null,
  courses: [],
  activities: [],
  lembagaList: [],
  loading: false,
  error: null,
})

export function useDashboard() {
  const hasChildren = computed(() => state.value.childRecords.length > 0)
  const selectedChild = computed(
    () => state.value.children.find((c) => c.id === state.value.selectedChildId) ?? null,
  )

  function updateScreeningUIState(id: string, action: ScreeningUIState) {
    const record = state.value.childRecords.find((r) => r.id === id)
    if (record) record.screeningAction = action
  }

  async function initialize() {
    state.value.loading = true
    state.value.error = null
    try {
      const [user, children, childRecords, lembagaList] = await Promise.all([
        dashboardService.getUser(),
        dashboardService.getChildren(),
        dashboardService.getChildRecords(),
        dashboardService.getLembagaList(),
      ])
      state.value.user = user
      state.value.children = children
      state.value.childRecords = childRecords
      state.value.lembagaList = lembagaList
    } catch (err) {
      state.value.error = (err as Error).message
    } finally {
      state.value.loading = false
    }
  }

  async function selectChild(id: string) {
    state.value.selectedChildId = id
  }

  async function addChild(payload: AddChildPayload) {
    const record = await dashboardService.addChildRecord(payload)
    state.value.childRecords.push(record)
    return record
  }

  async function updateChild(id: string, payload: AddChildPayload) {
    const record = await dashboardService.updateChildRecord(id, payload)
    const index = state.value.childRecords.findIndex((r) => r.id === id)
    if (index !== -1) state.value.childRecords[index] = record
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
    updateScreeningUIState,
    initialize,
    selectChild,
    addChild,
    updateChild,
    loadChildData,
  }
}

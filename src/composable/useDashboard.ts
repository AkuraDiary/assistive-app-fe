import { ref, computed, watch } from 'vue'
import type { DashboardUser } from '@/types/dashboard.types'
import { dashboardService } from '@/services/dashboard.service'
import { useChildren } from './useChildren'
import { useScreening } from './useScreening'
import { useCourse } from './useCourse'
import { useActivity } from './useActivity'

const user = ref<DashboardUser | null>(null)
const dashboardLoading = ref(false)
const dashboardError = ref<string | null>(null)
const selectedChildId = ref<string | null>(
  (sessionStorage.getItem('selectedChildId') as 'string | null') ?? null,
)

watch(selectedChildId, (childId) => sessionStorage.setItem('selectedChildId', childId ?? ''))

export function useDashboard() {
  const children = useChildren()
  const screening = useScreening(children.childRecords)
  const course = useCourse()
  const activity = useActivity()

  const selectedChild = computed(
    () => children.childRecords.value.find((c) => c._id === selectedChildId.value) ?? null,
  )

  async function selectChild(id: string | null) {
    selectedChildId.value = id
  }

  async function initialize() {
    dashboardLoading.value = true
    dashboardError.value = null
    try {
      const [fetchedUser] = await Promise.all([
        dashboardService.getUser(),
        children.fetchChildren(),
      ])
      user.value = fetchedUser
    } catch (err) {
      dashboardError.value = (err as Error).message
    } finally {
      dashboardLoading.value = false
    }
  }

  watch(
    [selectedChildId, user],
    ([id, currentUser]) => {
      if (currentUser?.role === 'teacher' || currentUser?.role === 'institution') {
        course.fetchAllStudentCourses()
      } else if (id) {
        course.fetchCourses(id)
        activity.fetchActivities(id)
      }
    },
    { immediate: true },
  )

  return {
    // state
    user,
    dashboardLoading,
    dashboardError,
    selectedChildId,
    selectedChild,

    ...children,
    ...screening,
    ...course,
    ...activity,

    // actions
    initialize,
    selectChild,
  }
}

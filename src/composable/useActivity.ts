import { ref } from 'vue'
import type { ActivityEntry } from '@/types/activity.types'
import { activityService } from '@/services/activity.service'

const activities = ref<ActivityEntry[]>([])
const loading = ref(false)

export function useActivity() {
  async function fetchActivities(childId: string) {
    loading.value = true
    try {
      const res = await activityService.getActivities(childId)
      if (res.success && res.data) {
        activities.value = res.data
      }
    } finally {
      loading.value = false
    }
  }

  return {
    activities,
    loading,
    fetchActivities,
  }
}
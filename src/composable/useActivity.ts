import { ref } from 'vue'
import type { ActivityEntry } from '@/types/activity.types'
import { activityService } from '@/services/activity.service'

const activities = ref<ActivityEntry[]>([])

export function useActivity() {
  async function fetchActivities(childId: string) {
    activities.value = await activityService.getActivities(childId)
  }

  return { activities, fetchActivities }
}
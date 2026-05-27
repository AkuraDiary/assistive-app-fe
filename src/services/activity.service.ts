import type { ActivityEntry } from '@/types/activity.types'
import { authAPI, USE_MOCK } from './api'


const MOCK_ACTIVITIES: ActivityEntry[] = []

export const activityService = {
  async getActivities(childId: string): Promise<ActivityEntry[]> {
    if (USE_MOCK) return MOCK_ACTIVITIES
    const res = await authAPI.get<ActivityEntry[]>(`/children/${childId}/activities`)
  return res.data ?? []
  },
}
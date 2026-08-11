import type { ActivityEntry } from '@/types/activity.types'
import { apiService, USE_MOCK, type ApiResponse } from './api'
import { mockActivities } from '@/mocks/activity.mock'

export const activityService = {
  async getActivities(childId: string): Promise<ApiResponse<ActivityEntry[]>> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      return { success: true, data: [...mockActivities] }
    }
    return await apiService.get<ActivityEntry[]>(`/children/${childId}/activities`)
  },
}

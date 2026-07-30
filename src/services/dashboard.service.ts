import type { DashboardUser } from '@/types/dashboard.types'
import { apiService, USE_MOCK } from './api'

const MOCK_USER: DashboardUser = { _id: 'u1', name: 'Budi Santoso' }

export const dashboardService = {
  async getUser(): Promise<DashboardUser> {
    if (USE_MOCK) return MOCK_USER
    const res = await apiService.get<DashboardUser>('/me')
    return res.data!
  },
}

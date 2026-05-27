import type { DashboardUser } from '@/types/dashboard.types'
import { authAPI, USE_MOCK } from './api'

const MOCK_USER: DashboardUser = { id: 'u1', name: 'Budi Santoso' }

export const dashboardService = {
  async getUser(): Promise<DashboardUser> {
    if (USE_MOCK) return MOCK_USER
    const res = await authAPI.get<DashboardUser>('/me')
    return res.data!
  },
}

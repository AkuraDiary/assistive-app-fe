import { mockStudents, mockActivities, mockCourses, mockInstitutionStats, mockInstitutionActivities, mockApplications, mockAdminActivities, mockAdminChartData, mockInstitutions } from '@/mocks/dashboard.mock'
import type { ApiResponse } from '@/services/api'
import type { ActivityEntry } from '@/types/activity.types'
import type { Course } from '@/types/course.types'
import type { DashboardUser } from '@/types/dashboard.types'
import { apiService, USE_MOCK } from '@/services/api'

export class DashboardService {
  async getStudents(): Promise<ApiResponse<any[]>> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return {
      success: true,
      data: [...mockStudents],
    }
  }

  async getUser(): Promise<DashboardUser> {
    if (USE_MOCK) {
      const stored = localStorage.getItem('auth_user')
      if (stored) {
        return JSON.parse(stored) as DashboardUser
      }
      return { _id: 'u1', name: 'Budi Santoso', role: 'parent' }
    }
    const res = await apiService.get<DashboardUser>('/me')
    return res.data!
  }

  async getActivities(studentId?: string): Promise<ApiResponse<ActivityEntry[]>> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    // In a real app we'd filter by studentId, here we return the mock list
    return {
      success: true,
      data: [...mockActivities],
    }
  }

  async getCourses(studentId?: string): Promise<ApiResponse<Course[]>> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    // Filter by studentId if needed
    return {
      success: true,
      data: [...mockCourses],
    }
  }

  async getInstitutionDashboardData(): Promise<ApiResponse<any>> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return {
      success: true,
      data: {
        stats: { ...mockInstitutionStats },
        recentActivities: [...mockInstitutionActivities],
        applications: [...mockApplications],
      }
    }
  }

  async getAdminDashboardData(): Promise<ApiResponse<any>> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return {
      success: true,
      data: {
        recentActivities: [...mockAdminActivities],
        chartData: { ...mockAdminChartData },
        institutions: [...mockInstitutions],
      }
    }
  }

  async updateApplicationStatus(id: string, status: 'diterima' | 'ditolak'): Promise<ApiResponse<void>> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const index = mockApplications.findIndex(a => a.id === id)
    if (index !== -1 && mockApplications[index]) {
      mockApplications[index]!.status = status
    }
    return { success: true }
  }
}

export const dashboardService = new DashboardService()

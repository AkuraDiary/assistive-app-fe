import { mockStudents, mockActivities, mockCourses, mockInstitutionStats, mockInstitutionActivities, mockApplications, mockAdminActivities, mockAdminChartData, mockInstitutions } from '@/mocks/dashboard.mock'
import type { ApiResponse } from '@/services/api'
import type { ActivityEntry } from '@/types/activity.types'
import type { Course } from '@/types/course.types'

export class DashboardService {
  async getStudents(): Promise<ApiResponse<any[]>> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return {
      success: true,
      data: mockStudents,
    }
  }

  async getActivities(studentId?: string): Promise<ApiResponse<ActivityEntry[]>> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    // In a real app we'd filter by studentId, here we return the mock list
    return {
      success: true,
      data: mockActivities,
    }
  }

  async getCourses(studentId?: string): Promise<ApiResponse<Course[]>> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    // Filter by studentId if needed
    return {
      success: true,
      data: mockCourses,
    }
  }

  async getInstitutionDashboardData(): Promise<ApiResponse<any>> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return {
      success: true,
      data: {
        stats: mockInstitutionStats,
        recentActivities: mockInstitutionActivities,
        applications: mockApplications,
      }
    }
  }

  async getAdminDashboardData(): Promise<ApiResponse<any>> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return {
      success: true,
      data: {
        recentActivities: mockAdminActivities,
        chartData: mockAdminChartData,
        institutions: mockInstitutions,
      }
    }
  }
}

export const dashboardService = new DashboardService()

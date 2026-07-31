import { mockStudents, mockTeachers, mockActivities, mockCourses, mockInstitutionStats, mockInstitutionActivities, mockApplications, mockAdminActivities, mockAdminChartData, mockInstitutions, mockRoles, mockModules } from '@/mocks/dashboard.mock'
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

  async getTeachers(): Promise<ApiResponse<any[]>> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return {
      success: true,
      data: [...mockTeachers],
    }
  }

  async getTeacherById(id: string): Promise<ApiResponse<any>> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const teacher = mockTeachers.find((t) => t._id === id)
    return {
      success: !!teacher,
      data: teacher,
    }
  }

  async getStudentsByTeacherId(teacherId: string): Promise<ApiResponse<any[]>> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const students = mockStudents.filter((s) => s.teacherId === teacherId)
    return {
      success: true,
      data: students,
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

  async getInstitutions(): Promise<ApiResponse<any[]>> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return {
      success: true,
      data: [...mockInstitutions],
    }
  }

  async getInstitutionById(id: string): Promise<ApiResponse<any>> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const institution = mockInstitutions.find(i => i._id === id)
    return {
      success: !!institution,
      data: institution
    }
  }

  async createInstitution(data: any): Promise<ApiResponse<void>> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const newId = 'inst' + (mockInstitutions.length + 1)
    mockInstitutions.push({
      _id: newId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      description: data.name,
      status: 'aktif',
      username: data.name.toLowerCase().replace(/\s+/g, '')
    })
    return { success: true }
  }

  async updateInstitution(id: string, data: any): Promise<ApiResponse<void>> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const index = mockInstitutions.findIndex(i => i._id === id)
    if (index !== -1 && mockInstitutions[index]) {
      mockInstitutions[index] = { ...mockInstitutions[index], ...data }
    }
    return { success: true }
  }

  async toggleInstitutionStatus(id: string): Promise<ApiResponse<void>> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const index = mockInstitutions.findIndex(i => i._id === id)
    if (index !== -1 && mockInstitutions[index]) {
      mockInstitutions[index].status = mockInstitutions[index].status === 'aktif' ? 'nonaktif' : 'aktif'
    }
    return { success: true }
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

  async updateStudentStatus(id: string, status: 'aktif' | 'nonaktif'): Promise<ApiResponse<void>> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const index = mockStudents.findIndex((s) => s._id === id)
    if (index !== -1 && mockStudents[index]) {
      mockStudents[index]!.status = status
    }
    return { success: true }
  }

  async getRoles(): Promise<ApiResponse<any[]>> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return {
      success: true,
      data: [...mockRoles],
    }
  }

  async getRoleById(id: string): Promise<ApiResponse<any>> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const role = mockRoles.find(r => r._id === id)
    return {
      success: !!role,
      data: role
    }
  }

  async createRole(data: any): Promise<ApiResponse<void>> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const newId = 'role' + (mockRoles.length + 1)
    mockRoles.push({
      _id: newId,
      name: data.name,
      description: data.description,
      status: 'aktif',
      access: data.access || []
    })
    return { success: true }
  }

  async updateRole(id: string, data: any): Promise<ApiResponse<void>> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const index = mockRoles.findIndex(r => r._id === id)
    if (index !== -1 && mockRoles[index]) {
      mockRoles[index] = { ...mockRoles[index], ...data }
    }
    return { success: true }
  }

  async toggleRoleStatus(id: string): Promise<ApiResponse<void>> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const index = mockRoles.findIndex(r => r._id === id)
    if (index !== -1 && mockRoles[index]) {
      mockRoles[index].status = mockRoles[index].status === 'aktif' ? 'nonaktif' : 'aktif'
    }
    return { success: true }
  }

  async getModules(): Promise<ApiResponse<any[]>> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return {
      success: true,
      data: [...mockModules],
    }
  }
}

export const dashboardService = new DashboardService()

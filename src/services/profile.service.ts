import type { ProfileUser } from '@/types/profile.types'
import { apiService, USE_MOCK, type ApiResponse } from './api'
import { mockProfile } from '@/mocks/profile.mock'

export const profileService = {
  async getProfile(): Promise<ApiResponse<ProfileUser>> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      return { success: true, data: { ...mockProfile } }
    }
    return await apiService.get<ProfileUser>('/profile')
  },

  async updateProfile(payload: Partial<ProfileUser>): Promise<ApiResponse<ProfileUser>> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      Object.assign(mockProfile, payload)
      return { success: true, data: { ...mockProfile } }
    }
    return await apiService.put<ProfileUser>('/profile', payload)
  },

  async uploadAvatar(file: File): Promise<ApiResponse<string>> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      const url = URL.createObjectURL(file)
      mockProfile.avatarUrl = url
      return { success: true, data: url }
    }
    const form = new FormData()
    form.append('avatar', file)
    const res = await apiService.post<{ avatarUrl: string }>('/profile/avatar', form)
    if (!res.success) return { success: false, message: res.message }
    return { success: true, data: res.data!.avatarUrl }
  },

  async getRoleStats(role: 'parent' | 'teacher' | 'school_admin' | 'super_admin'): Promise<ApiResponse<any>> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      if (role === 'teacher') {
        return {
          success: true,
          data: {
            studentsCount: 24,
            coursesCreated: 12,
            averageRating: 4.8
          }
        }
      }
      return {
        success: true,
        data: {
          childrenCount: 2,
          activeCourses: 5,
        }
      }
    }
    return await apiService.get(`/profile/stats?role=${role}`)
  }
}

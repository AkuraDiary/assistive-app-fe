import type { ChildRecord, AddChildPayload, Lembaga } from '@/types/child.types'
import { apiService, USE_MOCK, type ApiResponse } from './api'
import { mockLembaga, mockChildRecords } from '@/mocks/child.mock'

export const childService = {
  async getChildRecords(): Promise<ApiResponse<ChildRecord[]>> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      return { success: true, data: [...mockChildRecords] }
    }
    return await apiService.get<ChildRecord[]>('/children/records')
  },

  async addChildRecord(payload: AddChildPayload): Promise<ApiResponse<ChildRecord>> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      const lembaga = mockLembaga.find((l) => l._id === payload.institutionId)
      const record: ChildRecord = {
        _id: `c${Date.now()}`,
        ...payload,
        institutionId: payload.institutionId ?? null,
        applicationStatus: 'menunggu',
        screeningAction: payload.therapyType === 'individu' ? 'disable' : 'orang_tua',
      }
      mockChildRecords.push(record)
      return { success: true, data: record }
    }
    return await apiService.post<ChildRecord>('/children/records', payload)
  },

  async uploadChildAvatar(id: string, file: File): Promise<ApiResponse<string>> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      const index = mockChildRecords.findIndex((r) => r._id === id)
      if (index !== -1) {
        const url = URL.createObjectURL(file) // temp preview URL
        const existing = mockChildRecords[index]
        if (existing) {
          existing.avatar = url
        }
      }
      return { success: true, data: URL.createObjectURL(file) }
    }
    const form = new FormData()
    form.append('avatar', file)
    const res = await apiService.post<{ avatarUrl: string }>(`/children/records/${id}/avatar`, form)
    if (!res.success) return { success: false, message: res.message }
    return { success: true, data: res.data!.avatarUrl }
  },

  async updateChildRecord(id: string, payload: AddChildPayload): Promise<ApiResponse<ChildRecord>> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      const index = mockChildRecords.findIndex((r) => r._id === id)
      if (index !== -1) {
        const existing = mockChildRecords[index]
        const updated: ChildRecord = {
          _id: existing?._id ?? '',
          ...payload,
          institutionId: payload.institutionId ?? null,
          avatar: existing?.avatar ?? '',
          applicationStatus: payload.applicationStatus ?? 'menunggu',
          screeningAction: payload.applicationStatus === 'diterima' ? 'orang_tua' : 'disable',
        }
        mockChildRecords[index] = updated
        return { success: true, data: updated }
      }
      return { success: false, message: `Child record ${id} not found` }
    }
    return await apiService.put<ChildRecord>(`/children/records/${id}`, payload)
  },

  async deleteChildRecord(id: string): Promise<ApiResponse<void>> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      const index = mockChildRecords.findIndex((r) => r._id === id)
      if (index !== -1) mockChildRecords.splice(index, 1)
      return { success: true }
    }
    return await apiService.delete(`/children/records/${id}`)
  },

  async getLembagaList(): Promise<ApiResponse<Lembaga[]>> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      return { success: true, data: [...mockLembaga] }
    }
    return await apiService.get<Lembaga[]>('/lembaga')
  },
}

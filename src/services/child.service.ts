import type { ChildRecord, AddChildPayload, Lembaga, ChildStatus } from '@/types/child.types'
import { apiService, USE_MOCK } from './api'
import type { ApiResponse } from './api'

const MOCK_LEMBAGA: Lembaga[] = [
  { _id: 'l1', name: 'SLB Mutiara', description: 'Lorem ipsum odor amet,' },
  { _id: 'l2', name: 'SLB Harapan', description: 'Lorem ipsum odor amet,' },
]

export const MOCK_CHILD_RECORDS: ChildRecord[] = [
  {
    _id: 'c1',
    fullName: 'Fatur Rahman',
    dateOfBirth: '2026-05-02',
    gender: 'laki_laki',
    therapyType: 'individu',
    applicationStatus: 'diterima',
    screeningAction: 'lihat_hasil',
    institutionId: undefined,
  },
  {
    _id: 'c2',
    fullName: 'Budi Santoso',
    dateOfBirth: '2016-03-12',
    gender: 'laki_laki',
    therapyType: 'lembaga_sekolah',
    applicationStatus: 'menunggu',
    screeningAction: 'disable',
    institutionId: 'l1',
  },
  {
    _id: 'c3',
    fullName: 'Citra Kirana',
    dateOfBirth: '2015-11-20',
    gender: 'perempuan',
    therapyType: 'lembaga_sekolah',
    applicationStatus: 'diterima',
    screeningAction: 'orang_tua',
    avatar: '',
  },
]

export const childService = {
  async getChildRecords(): Promise<ChildRecord[]> {
    if (USE_MOCK) return [...MOCK_CHILD_RECORDS]
    const res = await apiService.get<ChildRecord[]>('/children/records')
    return res.data ?? []
  },

  async addChildRecord(payload: AddChildPayload): Promise<ChildRecord> {
    if (USE_MOCK) {
      const lembaga = MOCK_LEMBAGA.find((l) => l._id === payload.institutionId)
      const record: ChildRecord = {
        _id: `c${Date.now()}`,
        ...payload,
        institutionId: payload.institutionId ?? null,
        applicationStatus: 'menunggu',
        screeningAction: payload.therapyType === 'individu' ? 'disable' : 'orang_tua',
      }
      MOCK_CHILD_RECORDS.push(record)
      return record
    }
    const res = await apiService.post<ChildRecord>('/children/records', payload)
    return res.data!
  },

  async uploadChildAvatar(id: string, file: File): Promise<string> {
    if (USE_MOCK) {
      const index = MOCK_CHILD_RECORDS.findIndex((r) => r._id === id)
      if (index !== -1) {
        const url = URL.createObjectURL(file) // temp preview URL
        const existing = MOCK_CHILD_RECORDS[index]
        if (existing) {
          existing.avatar = url
        }
      }
      return URL.createObjectURL(file)
    }
    const form = new FormData()
    form.append('avatar', file)
    const res = await apiService.post<{ avatarUrl: string }>(`/children/records/${id}/avatar`, form)
    return res.data!.avatarUrl
  },
  async updateChildRecord(id: string, payload: AddChildPayload): Promise<ChildRecord> {
    if (USE_MOCK) {
      const index = MOCK_CHILD_RECORDS.findIndex((r) => r._id === id)
      if (index !== -1) {
        const existing = MOCK_CHILD_RECORDS[index]
        const updated: ChildRecord = {
          _id: existing?._id ?? '',
          ...payload,
          institutionId: payload.institutionId ?? null,
          avatar: existing?.avatar ?? '',
          applicationStatus: payload.applicationStatus ?? 'menunggu',
          screeningAction: payload.applicationStatus === 'diterima' ? 'orang_tua' : 'disable',
        }
        MOCK_CHILD_RECORDS[index] = updated
        return updated
      }
      throw new Error(`Child record ${id} not found`)
    }
    const res = await apiService.put<ChildRecord>(`/children/records/${id}`, payload)
    return res.data!
  },

  async deleteChildRecord(id: string): Promise<void> {
    if (USE_MOCK) {
      const index = MOCK_CHILD_RECORDS.findIndex((r) => r._id === id)
      if (index !== -1) MOCK_CHILD_RECORDS.splice(index, 1)
      return
    }
    await apiService.delete(`/children/records/${id}`)
  },

  async getLembagaList(): Promise<Lembaga[]> {
    if (USE_MOCK) return MOCK_LEMBAGA
    const res = await apiService.get<Lembaga[]>('/lembaga')
    return res.data ?? []
  },
}

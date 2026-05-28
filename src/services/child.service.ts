import type { ChildRecord, AddChildPayload, Lembaga, ChildStatus } from '@/types/child.types'
import { authAPI, USE_MOCK } from './api'
import type { ApiResponse } from './api'

const MOCK_LEMBAGA: Lembaga[] = [
  { id: 'l1', name: 'SLB Mutiara', description: 'Lorem ipsum odor amet,' },
  { id: 'l2', name: 'SLB Harapan', description: 'Lorem ipsum odor amet,' },
]

export const MOCK_CHILD_RECORDS: ChildRecord[] = [
  {
    id: 'c1',
    name: 'Fatur Rahman',
    tanggal: '2026-05-02',
    lembaga: 'SLB Mutiara',
    status: 'menunggu',
    screeningAction: 'disable',
    avatar: '',
  },
  {
    id: 'c2',
    name: 'Widarini Wijaya',
    tanggal: '2026-05-02',
    lembaga: 'Individu',
    status: 'diterima',
    screeningAction: 'lihat_hasil',
    avatar: '',
  },
  {
    id: 'c3',
    name: 'Azzi Wildan',
    tanggal: '2026-05-02',
    lembaga: 'SLB Mutiara',
    status: 'ditolak',
    screeningAction: 'orang_tua',
    avatar: '',
  },
]

export const childService = {
  async getChildRecords(): Promise<ChildRecord[]> {
    if (USE_MOCK) return [...MOCK_CHILD_RECORDS]
    const res = await authAPI.get<ChildRecord[]>('/children/records')
    return res.data ?? []
  },

  async addChildRecord(payload: AddChildPayload): Promise<ChildRecord> {
    if (USE_MOCK) {
      const lembaga = MOCK_LEMBAGA.find((l) => l.id === payload.lembagaId)
      const record: ChildRecord = {
        id: `c${Date.now()}`,
        name: payload.namaLengkap,
        tanggal: new Date().toISOString().split('T')[0],
        lembaga: lembaga?.name ?? 'Individu',
        status: 'menunggu',
        screeningAction: payload.jenisTerapi === 'lembaga_sekolah' ? 'disable' : 'orang_tua',
      }
      MOCK_CHILD_RECORDS.push(record)
      return record
    }
    const res = await authAPI.post<ChildRecord>('/children/records', payload)
    return res.data!
  },

  async uploadChildAvatar(id: string, file: File): Promise<string> {
    if (USE_MOCK) {
      const index = MOCK_CHILD_RECORDS.findIndex((r) => r.id === id)
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
    const res = await authAPI.post<{ avatarUrl: string }>(`/children/records/${id}/avatar`, form)
    return res.data!.avatarUrl
  },
  async updateChildRecord(id: string, payload: AddChildPayload): Promise<ChildRecord> {
    if (USE_MOCK) {
      const index = MOCK_CHILD_RECORDS.findIndex((r) => r.id === id)
      if (index !== -1) {
        const existing = MOCK_CHILD_RECORDS[index]
        const updated: ChildRecord = {
          id: existing?.id ?? '',
          name: payload.namaLengkap,
          tanggal: payload.tanggalLahir,
          lembaga: MOCK_LEMBAGA.find((l) => l.id === payload.lembagaId)?.name ?? 'Individu',
          avatar: existing?.avatar ?? '',
          status: (payload.status === 'ditolak'
            ? 'menunggu'
            : (payload.status ?? 'menunggu')) as ChildStatus,
          screeningAction: existing?.screeningAction ?? 'orang_tua',
        }
        MOCK_CHILD_RECORDS[index] = updated
        return updated
      }
      throw new Error(`Child record ${id} not found`)
    }
    const res = await authAPI.put<ChildRecord>(`/children/records/${id}`, payload)
    return res.data!
  },

  async deleteChildRecord(id: string): Promise<void> {
    if (USE_MOCK) {
      const index = MOCK_CHILD_RECORDS.findIndex((r) => r.id === id)
      if (index !== -1) MOCK_CHILD_RECORDS.splice(index, 1)
      return
    }
    await authAPI.delete(`/children/records/${id}`)
  },

  async getLembagaList(): Promise<Lembaga[]> {
    if (USE_MOCK) return MOCK_LEMBAGA
    const res = await authAPI.get<Lembaga[]>('/lembaga')
    return res.data ?? []
  },
}

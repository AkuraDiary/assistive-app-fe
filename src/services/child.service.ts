import type { ChildRecord, AddChildPayload, Lembaga } from '@/types/child.types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
const USE_MOCK = !BASE_URL

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`)
  return res.json() as Promise<T>
}

const MOCK_LEMBAGA: Lembaga[] = [
  { id: 'l1', name: 'SLB Mutiara', description: 'Lorem ipsum odor amet,' },
  { id: 'l2', name: 'SLB Harapan', description: 'Lorem ipsum odor amet,' },
]

export const MOCK_CHILD_RECORDS: ChildRecord[] = [
  { id: 'c1', name: 'Fatur Rahman', tanggal: '2026-05-02', lembaga: 'SLB Mutiara', status: 'menunggu', screeningAction: 'disable' },
  { id: 'c2', name: 'Widarini Wijaya', tanggal: '2026-05-02', lembaga: 'Individu', status: 'diterima', screeningAction: 'lihat_hasil' },
  { id: 'c3', name: 'Azzi Wildan', tanggal: '2026-05-02', lembaga: 'SLB Mutiara', status: 'ditolak', screeningAction: 'orang_tua' },
]

export const childService = {
  async getChildRecords(): Promise<ChildRecord[]> {
    if (USE_MOCK) return [...MOCK_CHILD_RECORDS]
    return request<ChildRecord[]>('/api/v1/children/records')
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
    return request<ChildRecord>('/api/v1/children/records', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
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
          status: 'menunggu',
          screeningAction: existing?.screeningAction ?? 'orang_tua',
        }
        MOCK_CHILD_RECORDS[index] = updated
        return updated
      }
      throw new Error(`Child record ${id} not found`)
    }
    return request<ChildRecord>(`/api/v1/children/records/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },

  async deleteChildRecord(id: string): Promise<void> {
    if (USE_MOCK) {
      const index = MOCK_CHILD_RECORDS.findIndex((r) => r.id === id)
      if (index !== -1) MOCK_CHILD_RECORDS.splice(index, 1)
      return
    }
    return request<void>(`/api/v1/children/records/${id}`, { method: 'DELETE' })
  },

  async getLembagaList(): Promise<Lembaga[]> {
    if (USE_MOCK) return MOCK_LEMBAGA
    return request<Lembaga[]>('/api/v1/lembaga')
  },
}
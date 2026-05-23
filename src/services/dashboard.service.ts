import type {
  Child,
  Course,
  ActivityEntry,
  DashboardUser,
  ChildRecord,
  AddChildPayload,
  Lembaga,
  ScreeningQuestion,
  ScreeningPayload,
  ScreeningResult,
} from '@/types/dashboard.types'

// ─── Config ──────────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`)
  return res.json() as Promise<T>
}

// ─── Mock data (remove when backend is ready) ─────────────────────────────────
const MOCK_USER: DashboardUser = { id: 'u1', name: 'Budi Santoso' }

const MOCK_CHILD_RECORDS: ChildRecord[] = [
  {
    id: 'c1',
    name: 'Fatur Rahman',
    avatar: undefined,
    tanggal: '2026-05-02',
    lembaga: 'SLB Mutiara',
    status: 'menunggu',
    screeningAction: 'disable',
  },
  {
    id: 'c2',
    name: 'Widarini Wijaya',
    avatar: undefined,
    tanggal: '2026-05-02',
    lembaga: 'Individu',
    status: 'diterima',
    screeningAction: 'orang_tua',
  },
  {
    id: 'c3',
    name: 'Azzi Wildan',
    avatar: undefined,
    tanggal: '2026-05-02',
    lembaga: 'SLB Mutiara',
    status: 'ditolak',
    screeningAction: 'lihat_hasil',
  },
]

const MOCK_LEMBAGA: Lembaga[] = [
  { id: 'l1', name: 'SLB Mutiara', description: 'Lorem ipsum odor amet,' },
  { id: 'l2', name: 'SLB Harapan', description: 'Lorem ipsum odor amet,' },
]

const MOCK_COURSES: Course[] = [
  { id: 'cr1', name: 'Course 1', progress: 75, completedSessions: 6, totalSessions: 8 },
  { id: 'cr2', name: 'Course 2', progress: 40, completedSessions: 4, totalSessions: 10 },
  { id: 'cr3', name: 'Course 3', progress: 20, completedSessions: 2, totalSessions: 10 },
  { id: 'cr4', name: 'Course 4', progress: 0, completedSessions: 0, totalSessions: 8 },
  { id: 'cr5', name: 'Course 5', progress: 90, completedSessions: 9, totalSessions: 10 },
]

const MOCK_CHILDREN: Child[] = [
  { id: 'c1', name: 'Fatur Rahman' },
  { id: 'c2', name: 'Widarini Wijaya' },
  { id: 'c3', name: 'Azzi Wildan' },
]
const MOCK_ACTIVITIES: ActivityEntry[] = []

const MOCK_SCREENING_QUESTIONS_ORTU: ScreeningQuestion[] = [
  { id: 'q1', order: 1, text: 'Apakah beliau mengalami kesulitan dalam mengeja?', required: true },
  {
    id: 'q2',
    order: 2,
    text: 'Apakah beliau mengalami kesulitan dalam penamaan huruf?',
    required: true,
  },
  {
    id: 'q3',
    order: 3,
    text: 'Apakah beliau mengalami kesulitan dalam pelafalan bunyi huruf?',
    required: true,
  },
  { id: 'q4', order: 4, text: 'Apakah beliau membaca dengan lambat?', required: true },
  { id: 'q5', order: 5, text: 'Apakah beliau sering membalik huruf saat menulis?', required: true },
]

const MOCK_SCREENING_QUESTIONS_ANAK: ScreeningQuestion[] = [
  { id: 'q1', order: 1, text: 'Apakah kamu kesulitan mengeja kata-kata?', required: true },
  { id: 'q2', order: 2, text: 'Apakah kamu kesulitan mengenal huruf?', required: true },
  { id: 'q3', order: 3, text: 'Apakah kamu kesulitan membaca dengan lancar?', required: true },
  { id: 'q4', order: 4, text: 'Apakah kamu sering lupa urutan huruf?', required: true },
  { id: 'q5', order: 5, text: 'Apakah kamu kesulitan menulis dengan rapi?', required: true },
]

const MOCK_SCREENING_RESULTS: ScreeningResult[] = []

const USE_MOCK = !BASE_URL

// ─── Endpoints ────────────────────────────────────────────────────────────────
export const dashboardService = {
  async getUser(): Promise<DashboardUser> {
    if (USE_MOCK) return MOCK_USER
    return request<DashboardUser>('/api/v1/me')
  },

  async getChildren(): Promise<Child[]> {
    if (USE_MOCK) return MOCK_CHILDREN
    return request<Child[]>('/api/v1/children')
  },

  async addChild(name: string): Promise<Child> {
    if (USE_MOCK) {
      const child: Child = { id: `c${Date.now()}`, name }
      MOCK_CHILDREN.push(child)
      return child
    }
    return request<Child>('/api/v1/children', {
      method: 'POST',
      body: JSON.stringify({ name }),
    })
  },

  async getCourses(childId: string): Promise<Course[]> {
    if (USE_MOCK) return MOCK_COURSES
    return request<Course[]>(`/api/v1/children/${childId}/courses`)
  },

  async getActivities(childId: string): Promise<ActivityEntry[]> {
    if (USE_MOCK) return MOCK_ACTIVITIES
    return request<ActivityEntry[]>(`/api/v1/children/${childId}/activities`)
  },

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

  async getLembagaList(): Promise<Lembaga[]> {
    if (USE_MOCK) return MOCK_LEMBAGA
    return request<Lembaga[]>('/api/v1/lembaga')
  },

  // mock stubs for screening
  async getScreeningQuestions(type: 'orang_tua' | 'anak'): Promise<ScreeningQuestion[]> {
    if (USE_MOCK) {
      return type === 'orang_tua'
        ? [...MOCK_SCREENING_QUESTIONS_ORTU]
        : [...MOCK_SCREENING_QUESTIONS_ANAK]
    }
    return request<ScreeningQuestion[]>(`/api/v1/screening/questions?type=${type}`)
  },
  async submitScreening(payload: ScreeningPayload): Promise<void> {
    if (USE_MOCK) {
      MOCK_SCREENING_RESULTS.push({
        id: `sr${Date.now()}`,
        childId: payload.childId,
        screeningType: payload.screeningType,
        answers: payload.answers,
        score: Math.round(
          (payload.answers.reduce((s, a) => s + a.value, 0) / payload.answers.length) * 20,
        ),
        completedAt: new Date().toISOString(),
        recommendation: 'Perlu evaluasi lebih lanjut.',
      })
      return
    }
    return request<void>('/api/v1/screening/submit', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  async getScreeningResult(childId: string): Promise<ScreeningResult[]> {
    if (USE_MOCK) return MOCK_SCREENING_RESULTS.filter((r) => r.childId === childId)
    return request<ScreeningResult[]>(`/api/v1/screening/results?childId=${childId}`)
  },
}

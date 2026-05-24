export type ChildStatus = 'menunggu' | 'diterima' | 'ditolak'
export type ScreeningType = 'orang_tua' | 'anak'
export type ScreeningUIState = 'disable' | 'lihat_hasil' | ScreeningType
export type JenisKelamin = 'laki_laki' | 'perempuan'
export type JenisTerapi = 'individu' | 'lembaga_sekolah'
export type QuestionType = 'tap' | 'voice' | 'upload'

// records
export interface ChildRecord {
  id: string
  name: string
  avatar?: string
  tanggal?: string // ISO date string
  lembaga: string
  status: ChildStatus
  screeningAction: ScreeningUIState
}

export interface AddChildPayload {
  namaLengkap: string
  tanggalLahir: string
  alamat?: string
  jenisKelamin?: JenisKelamin
  jenisTerapi: JenisTerapi
  lembagaId?: string // required if jenisTerapi === 'lembaga_sekolah'
}

export interface Lembaga {
  id: string
  name: string
  description?: string
}

export interface Child {
  id: string
  name: string
  avatar?: string
}

export interface Course {
  id: string
  name: string
  progress: number // 0–100
  completedSessions: number
  totalSessions: number
}

export interface ActivityEntry {
  id: string
  childId: string
  date: string // ISO string
  durationMinutes: number
  topic: string
  score?: number
}

//screening

export interface ScreeningAnswer {
  questionId: string
  value: number // 1–5
}

export interface ScreeningPayload {
  childId: string
  screeningType: ScreeningType
  answers: ScreeningAnswer[]
}

export interface ScreeningQuestion {
  id: string
  order: number
  text: string
  required: boolean
  questionType?: QuestionType // ← new
  mediaLabel?: string // e.g. "Animasi", "Huruf/Teks" shown on the card
  mediaUrl?: string // image/animation URL from backend
  options?: string[] // for tap: A, I, U choices
}

// screening results

export interface CategoryScore {
  label: string
  score: number // raw score
  max: number // max possible (e.g. 10)
}

export interface ScreeningResult {
  id: string
  childId: string
  screeningType: ScreeningType
  answers: ScreeningAnswer[]
  score: number
  completedAt: string // ISO string
  recommendation?: string
  categoryScores?: CategoryScore[]
  dyslexiaLevel?: number
}

// dashboards
export interface DashboardUser {
  id: string
  name: string
  avatar?: string
}

export interface DashboardState {
  user: DashboardUser | null
  children: Child[]
  childRecords: ChildRecord[]
  selectedChildId: string | null
  courses: Course[]
  activities: ActivityEntry[]
  lembagaList: Lembaga[]
  loading: boolean
  error: string | null
}

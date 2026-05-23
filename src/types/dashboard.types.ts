
export type ChildStatus = 'menunggu' | 'diterima' | 'ditolak'
export type ScreeningAction = 'disable' | 'orang_tua' | 'anak' | 'lihat_hasil' 
export type JenisKelamin = 'laki_laki' | 'perempuan'
export type JenisTerapi = 'individu' | 'lembaga_sekolah'

export interface ChildRecord {
  id: string
  name: string
  avatar?: string
  tanggal?: string        // ISO date string
  lembaga: string
  status: ChildStatus
  screeningAction: ScreeningAction
}

export interface AddChildPayload {
  namaLengkap: string
  tanggalLahir: string
  alamat?: string
  jenisKelamin?: JenisKelamin
  jenisTerapi: JenisTerapi
  lembagaId?: string     // required if jenisTerapi === 'lembaga_sekolah'
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
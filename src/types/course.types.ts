export type CourseStatus = 'dipelajari' | 'selesai' | 'belum'
export type MetodeBelajar = 'membaca' | 'mendengar' | 'menulis'

// Used by dashboard panel (lightweight)
export interface CourseExercise {
  id: string
  title: string
  progress: number
}

export interface Course {
  id: string
  name: string
  level?: string
  progress: number
  completedSessions: number
  totalSessions: number
  tanggalMulai?: string
  status?: CourseStatus
  exercises?: CourseExercise[]  // ← kept for dashboard panel
  studentName?: string // Used for Teacher view
}

export type ModuleType = 'materi' | 'assessment'

export interface CourseModule {
  id: string
  title: string
  description?: string
  type: ModuleType
  progress?: number
  tanggalDikerjakan?: string
  isLocked: boolean

  // If materi
  materi?: MateriContent[]

  // If assessment
  level?: string
  categories?: string[] // Kata, Kalimat, Objek
  skills?: string[] // Mendengar, Menulis, Membaca
  questions?: AssessmentQuestion[]
}

export interface CourseDetail extends Course {
  description?: string
  modules: CourseModule[]
}


export interface MateriSyllable {
  text: string
  color?: 'blue' | 'green' | 'default'
}

export interface MateriWord {
  id: string
  text: string
  syllables: MateriSyllable[]
}

export interface MateriContent {
  id: string
  metodeBelajar: MetodeBelajar
  title: string
  subtitle?: string
  mediaUrl?: string
  words: MateriWord[]
  focusHuruf?: string
  focusInstruction?: string
  tips?: string
}

export interface AssessmentQuestion {
  id: string
  questionType: 'voice' | 'upload' | 'tap' | 'rapid-naming' |  string
  category: string
  text: string
  mediaLabel?: string
  audioUrl?: string
  rapidNamingType?: 'color' | 'picture' | string
  rapidNamingItems?: string[]
  options?: string[]
  correctAnswer?: string
}
export type CourseStatus = 'dipelajari' | 'selesai' | 'belum'

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
}

// Used by detail page (rich)
export interface LatihanItem {
  id: string
  title: string
  description?: string
  progress: number
  tanggalDikerjakan?: string
  isLocked: boolean
}

export interface Modul {
  id: string
  label: string
  description?: string
  latihan: LatihanItem[]
}

export interface AssessmentItem {
  id: string
  title: string
  description?: string
  level: string
  skills: string[]
  tanggalDikerjakan?: string
  isLocked: boolean
}

export interface CourseDetail extends Course {
  description?: string
  totalModul: number
  totalAssessment: number
  moduls: Modul[]
  assessments: AssessmentItem[]
}
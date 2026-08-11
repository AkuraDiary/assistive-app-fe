export * from './module.types'
export * from './assessment.types'
export * from './materi.types'

import type { CourseModule } from './module.types'

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
  studentName?: string // Used for Teacher view
}

export interface CourseDetail extends Course {
  description?: string
  modules: CourseModule[]
}
export type CourseStatus = 'dipelajari' | 'selesai' | 'belum'

export interface CourseExercise {
  id: string
  title: string
  isCompleted: boolean
  progress: number
  completedSessions: number
  totalSessions: number
}

export interface Course {
  id: string
  name: string
  level?: string // ← "Level : 2 (Dua)"
  progress: number
  completedSessions: number
  totalSessions: number
  tanggalMulai?: string // ← ISO date string
  status?: CourseStatus // ← new
  exercises?: CourseExercise[]
}

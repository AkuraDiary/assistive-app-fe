import type { MateriContent } from './materi.types'
import type { AssessmentQuestion } from './assessment.types'

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
  durationMinutes?: number // Batas Waktu
}

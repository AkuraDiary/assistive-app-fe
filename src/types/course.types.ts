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
  progress: number
  completedSessions: number
  totalSessions: number
  exercises?: CourseExercise[]
}

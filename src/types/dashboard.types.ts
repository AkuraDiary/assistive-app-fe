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
  selectedChildId: string | null
  courses: Course[]
  activities: ActivityEntry[]
  loading: boolean
  error: string | null
}
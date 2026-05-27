import type { ChildRecord, Lembaga } from './child.types'
import type { Course } from './course.types'
import type { ActivityEntry } from './activity.types'

// dashboards
export interface DashboardUser {
  id: string
  name: string
  avatar?: string
}

export interface DashboardState {
  user: DashboardUser | null
  children: ChildRecord[]
  childRecords: ChildRecord[]
  selectedChildId: string | null
  courses: Course[]
  activities: ActivityEntry[]
  lembagaList: Lembaga[]
  loading: boolean
  error: string | null
}

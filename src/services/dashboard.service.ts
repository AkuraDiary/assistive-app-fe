import type { Child, Course, ActivityEntry, DashboardUser } from '@/types/dashboard.types'

// ─── Config ──────────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`)
  return res.json() as Promise<T>
}

// ─── Mock data (remove when backend is ready) ─────────────────────────────────
const MOCK_USER: DashboardUser = { id: 'u1', name: 'Budi Santoso' }
const MOCK_CHILDREN: Child[] = [
  { id: 'c1', name: 'Fatur Rahman' },
  { id: 'c2', name: 'Siti Rahayu' },
]
const MOCK_COURSES: Course[] = [
  { id: 'cr1', name: 'Course 1', progress: 75, completedSessions: 6, totalSessions: 8 },
  { id: 'cr2', name: 'Course 2', progress: 40, completedSessions: 4, totalSessions: 10 },
  { id: 'cr3', name: 'Course 3', progress: 20, completedSessions: 2, totalSessions: 10 },
  { id: 'cr4', name: 'Course 4', progress: 0,  completedSessions: 0, totalSessions: 8 },
  { id: 'cr5', name: 'Course 5', progress: 90, completedSessions: 9, totalSessions: 10 },
]
const MOCK_ACTIVITIES: ActivityEntry[] = []

const USE_MOCK = !BASE_URL

// ─── Endpoints ────────────────────────────────────────────────────────────────
export const dashboardService = {
  async getUser(): Promise<DashboardUser> {
    if (USE_MOCK) return MOCK_USER
    return request<DashboardUser>('/api/v1/me')
  },

  async getChildren(): Promise<Child[]> {
    if (USE_MOCK) return MOCK_CHILDREN
    return request<Child[]>('/api/v1/children')
  },

  async addChild(name: string): Promise<Child> {
    if (USE_MOCK) {
      const child: Child = { id: `c${Date.now()}`, name }
      MOCK_CHILDREN.push(child)
      return child
    }
    return request<Child>('/api/v1/children', {
      method: 'POST',
      body: JSON.stringify({ name }),
    })
  },

  async getCourses(childId: string): Promise<Course[]> {
    if (USE_MOCK) return MOCK_COURSES
    return request<Course[]>(`/api/v1/children/${childId}/courses`)
  },

  async getActivities(childId: string): Promise<ActivityEntry[]> {
    if (USE_MOCK) return MOCK_ACTIVITIES
    return request<ActivityEntry[]>(`/api/v1/children/${childId}/activities`)
  },
}
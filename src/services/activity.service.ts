import type { ActivityEntry } from '@/types/activity.types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
const USE_MOCK = !BASE_URL

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`)
  return res.json() as Promise<T>
}

const MOCK_ACTIVITIES: ActivityEntry[] = []

export const activityService = {
  async getActivities(childId: string): Promise<ActivityEntry[]> {
    if (USE_MOCK) return MOCK_ACTIVITIES
    return request<ActivityEntry[]>(`/api/v1/children/${childId}/activities`)
  },
}
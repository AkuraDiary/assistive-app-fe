import type { Course } from '@/types/course.types'
import { authAPI, USE_MOCK } from './api'

const MOCK_COURSES: Course[] = [
  { id: 'cr1', name: 'Course 1', progress: 75, completedSessions: 6, totalSessions: 8 },
  { id: 'cr2', name: 'Course 2', progress: 40, completedSessions: 4, totalSessions: 10 },
  { id: 'cr3', name: 'Course 3', progress: 20, completedSessions: 2, totalSessions: 10 },
  { id: 'cr4', name: 'Course 4', progress: 0, completedSessions: 0, totalSessions: 8 },
  { id: 'cr5', name: 'Course 5', progress: 90, completedSessions: 9, totalSessions: 10 },
]

export const courseService = {
  async getCourses(childId: string): Promise<Course[]> {
    if (USE_MOCK) return MOCK_COURSES
    const res = await authAPI.get<Course[]>(`/children/${childId}/courses`)
    return res.data ?? []
  },
}

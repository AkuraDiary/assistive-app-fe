import type { Course } from '@/types/course.types'
import { authAPI, USE_MOCK } from './api'

const MOCK_COURSES: Course[] = [
  {
    id: 'cr1',
    name: 'Membaca',
    progress: 75,
    completedSessions: 3,
    totalSessions: 4,
    exercises: [
      { id: 'ex1', title: 'Mengenal Huruf Vokal', isCompleted: true },
      { id: 'ex2', title: 'Membaca Suku Kata', isCompleted: true },
      { id: 'ex3', title: 'Membaca Kata Pendek', isCompleted: true },
      { id: 'ex4', title: 'Membaca Kalimat', isCompleted: false },
    ],
  },
  {
    id: 'cr2',
    name: 'Berhitung',
    progress: 40,
    completedSessions: 2,
    totalSessions: 5,
    exercises: [
      { id: 'ex5', title: 'Mengenal Angka 1-10', isCompleted: true },
      { id: 'ex6', title: 'Menghitung Benda', isCompleted: true },
      { id: 'ex7', title: 'Penjumlahan Dasar', isCompleted: false },
      { id: 'ex8', title: 'Pengurangan Dasar', isCompleted: false },
      { id: 'ex9', title: 'Soal Cerita', isCompleted: false },
    ],
  },

  { id: 'cr3', name: 'Course 3', progress: 20, completedSessions: 2, totalSessions: 10 },
  { id: 'cr4', name: 'Course A', progress: 20, completedSessions: 2, totalSessions: 10 },
  { id: 'cr5', name: 'Course A', progress: 20, completedSessions: 2, totalSessions: 10 },
  { id: 'cr6', name: 'Course A', progress: 20, completedSessions: 2, totalSessions: 10 },
  { id: 'cr7', name: 'Course A', progress: 20, completedSessions: 2, totalSessions: 10 },
  { id: 'cr8', name: 'Course A', progress: 20, completedSessions: 2, totalSessions: 10 },
  { id: 'cr9', name: 'Course A', progress: 20, completedSessions: 2, totalSessions: 10 },
  { id: 'cr10', name: 'Course 10', progress: 20, completedSessions: 2, totalSessions: 10 },
]
export const courseService = {
  async getCourses(childId: string): Promise<Course[]> {
    if (USE_MOCK) return MOCK_COURSES
    const res = await authAPI.get<Course[]>(`/children/${childId}/courses`)
    return res.data ?? []
  },
}

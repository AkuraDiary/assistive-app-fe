import type { Course, CourseDetail, AssessmentAnswer, AssessmentQuestion } from '@/types/course.types'
import { apiService, USE_MOCK, type ApiResponse } from './api'
import { ref } from 'vue'
import { mockCourses, mockTeacherCourses, mockCourseDetail } from '@/mocks/course.mock'

export const latestAssessmentAnswers = ref<Record<string, AssessmentAnswer>>({})

export const courseService = {
  async getCourses(childId: string): Promise<ApiResponse<Course[]>> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      return { success: true, data: mockCourses }
    }
    return await apiService.get<Course[]>(`/children/${childId}/courses`)
  },

  async getAllStudentCourses(): Promise<ApiResponse<Course[]>> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      return { success: true, data: mockTeacherCourses }
    }
    return await apiService.get<Course[]>(`/teacher/courses`)
  },

  async getCourseDetail(childId: string, courseId: string): Promise<ApiResponse<CourseDetail>> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      let courseDetail = mockCourseDetail.find((l) => l.id === courseId)
      if (!courseDetail) {
        courseDetail = mockCourseDetail[0]
      }
      if (courseDetail) {
        return { success: true, data: { ...courseDetail, id: courseId } }
      }
      return { success: false, message: 'Course detail not found' }
    }
    return await apiService.get<CourseDetail>(`/children/${childId}/courses/${courseId}`)
  },

  async addModulToCourse(
    courseId: string,
    payload: { label: string; description: string; hasLatihan: boolean },
  ): Promise<ApiResponse<string>> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      const course = mockCourseDetail.find((c) => c.id === courseId) || mockCourseDetail[0]
      const newId = `l${Date.now()}`
      if (course) {
        course.modules.push({
          id: newId,
          title: payload.label,
          description: payload.description,
          type: 'materi',
          progress: 0,
          isLocked: false,
          materi: [],
        })
        return { success: true, data: newId }
      }
      return { success: false, message: 'Course not found' }
    }
    const res = await apiService.post<{ id: string }>(`/teacher/courses/${courseId}/moduls`, payload)
    if (!res.success) return { success: false, message: res.message }
    return { success: true, data: res.data?.id || 'm1' }
  },

  async addAssessmentToCourse(
    courseId: string,
    payload: { title: string; description: string; poinMinimal: number; categories: string[]; durationMinutes?: number },
  ): Promise<ApiResponse<string>> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      const course = mockCourseDetail.find((c) => c.id === courseId) || mockCourseDetail[0]
      const newId = `a${Date.now()}`
      if (course) {
        course.modules.push({
          id: newId,
          title: payload.title,
          description: payload.description,
          type: 'assessment',
          level: 'Level 1',
          categories: payload.categories,
          skills: ['Mendengar', 'Menulis', 'Membaca'],
          isLocked: false,
          durationMinutes: payload.durationMinutes,
        })
        return { success: true, data: newId }
      }
      return { success: false, message: 'Course not found' }
    }
    const res = await apiService.post<{ id: string }>(`/teacher/courses/${courseId}/assessments`, payload)
    if (!res.success) return { success: false, message: res.message }
    return { success: true, data: res.data?.id || 'a1' }
  },

  async updateAssessmentQuestions(
    courseId: string,
    moduleId: string,
    questions: AssessmentQuestion[]
  ): Promise<ApiResponse<void>> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300))
      const course = mockCourseDetail.find((c) => c.id === courseId)
      if (course) {
        const module = course.modules.find((m) => m.id === moduleId)
        if (module) {
          module.questions = questions
          return { success: true, data: undefined }
        }
      }
      return { success: false, message: 'Module not found' }
    }
    const res = await apiService.put<{ id: string }>(`/teacher/courses/${courseId}/assessments/${moduleId}/questions`, { questions })
    if (!res.success) return { success: false, message: res.message }
    return { success: true, data: undefined }
  }
}

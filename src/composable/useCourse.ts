import { ref } from 'vue'
import type { Course } from '@/types/course.types'
import { courseService } from '@/services/course.service'

const courses = ref<Course[]>([])

export function useCourse() {
  async function fetchCourses(childId: string) {
    courses.value = await courseService.getCourses(childId)
  }

  return { courses, fetchCourses }
}
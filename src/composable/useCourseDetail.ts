import { computed, ref } from 'vue'
import type { CourseDetail } from '@/types/course.types'
import { courseService } from '@/services/course.service'
import { useCourse } from './useCourse'

const courseDetail = ref<CourseDetail | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

export function useCourseDetail() {
  const { courses } = useCourse()
  async function fetchCourseDetail(childId: string, courseId: string) {
    loading.value = true
    error.value = null
    try {
      courseDetail.value = await courseService.getCourseDetail(childId, courseId)
    } catch (err) {
      error.value = (err as Error).message
    } finally {
      loading.value = false
    }
  }

  const currentIndex = computed(() =>
    courses.value.findIndex((c) => c.id === courseDetail.value?.id),
  )

  const prevCourse = computed(() =>
    currentIndex.value > 0 ? courses.value[currentIndex.value - 1] : null,
  )

  const nextCourse = computed(() =>
     currentIndex.value < courses.value.length - 1 ? courses.value[currentIndex.value + 1] : null,
  )
  return {
    courseDetail,
    nextCourse,
    prevCourse,
    loading,
    error,
    fetchCourseDetail,
  }
}

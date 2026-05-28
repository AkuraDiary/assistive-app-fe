import { computed, ref } from 'vue'
import type { CourseDetail } from '@/types/course.types'
import { courseService } from '@/services/course.service'

const courseDetail = ref<CourseDetail | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const activeModulId = ref<string | null>(null)

export function useCourseDetail() {
  async function fetchCourseDetail(childId: string, courseId: string) {
    loading.value = true
    error.value = null
    try {
      courseDetail.value = await courseService.getCourseDetail(childId, courseId)
      activeModulId.value = courseDetail.value.moduls[0]?.id ?? null
    } catch (err) {
      error.value = (err as Error).message
    } finally {
      loading.value = false
    }
  }

  function setActiveModul(id: string) {
    activeModulId.value = id
  }

  const activeModul = computed(() =>
    courseDetail.value?.moduls.find((m) => m.id === activeModulId.value) ?? null,
  )

  return {
    courseDetail,
    activeModul,
    activeModulId,
    loading,
    error,
    fetchCourseDetail,
    setActiveModul,
  }
}
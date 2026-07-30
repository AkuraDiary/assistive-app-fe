import { ref, computed } from 'vue'
import type { Course, CourseStatus } from '@/types/course.types'
import { courseService } from '@/services/course.service'

const courses = ref<Course[]>([])
const filterStatus = ref<CourseStatus | 'semua'>('semua')
const currentPage = ref(1)
const perPage = ref(5)

export function useCourse() {
  const filteredCourses = computed(() =>
    filterStatus.value === 'semua'
      ? courses.value
      : courses.value.filter((c) => c.status === filterStatus.value),
  )

  const totalPages = computed(() => Math.ceil(filteredCourses.value.length / perPage.value))

  const paginatedCourses = computed(() => {
    const start = (currentPage.value - 1) * perPage.value
    return filteredCourses.value.slice(start, start + perPage.value)
  })

  async function fetchCourses(childId: string) {
    courses.value = await courseService.getCourses(childId)
    currentPage.value = 1
  }

  async function fetchAllStudentCourses() {
    courses.value = await courseService.getAllStudentCourses()
    currentPage.value = 1
  }

  function setFilter(status: CourseStatus | 'semua') {
    filterStatus.value = status
    currentPage.value = 1
  }

  function setPage(page: number) {
    currentPage.value = page
  }

  function setPerPage(n: number) {
    perPage.value = n
    currentPage.value = 1
  }

  return {
    courses,
    filteredCourses,
    paginatedCourses,
    filterStatus,
    currentPage,
    perPage,
    totalPages,
    fetchCourses,
    fetchAllStudentCourses,
    setFilter,
    setPage,
    setPerPage,
  }
}

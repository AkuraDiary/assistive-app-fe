<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composable/useAuth'
import SharedActivityPanel from '@/components/dashboard/SharedActivityPanel.vue'
import SharedCourseProgressPanel from '@/components/dashboard/SharedCourseProgressPanel.vue'
import { dashboardService } from '@/services/dashboard.service'
import type { ActivityEntry } from '@/types/activity.types'
import type { Course } from '@/types/course.types'

const { user } = useAuth()

const loading = ref(true)
const students = ref<any[]>([])
const selectedStudentId = ref<string | null>(null)
const activities = ref<ActivityEntry[]>([])
const courses = ref<Course[]>([])

async function loadData() {
  loading.value = true
  try {
    const [studentsRes, activitiesRes, coursesRes] = await Promise.all([
      dashboardService.getStudents(),
      dashboardService.getActivities(),
      dashboardService.getCourses(),
    ])

    if (studentsRes.success) {
      students.value = studentsRes.data || []
      if (students.value.length > 0) {
        selectedStudentId.value = students.value[0]._id
      }
    }
    
    if (activitiesRes.success) {
      activities.value = activitiesRes.data || []
    }

    if (coursesRes.success) {
      courses.value = coursesRes.data || []
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

function handleStudentChange(id: string) {
  selectedStudentId.value = id
  // In a real app we'd reload activities and courses here
}
</script>

<template>
  <div class="teacher-dashboard">
    <div class="teacher-dashboard__header">
      <h1 class="teacher-dashboard__title">Selamat datang, Bu {{ user?.fullName?.split(' ')[0] || 'Guru' }}</h1>
      <p class="teacher-dashboard__subtitle">Yuk segera cek progress perkembangan si anak!</p>
    </div>
    
    <div class="teacher-dashboard__panels">
      <div class="col-span-12 lg:col-span-5 flex flex-col">
        <SharedActivityPanel 
          :activities="activities" 
          :loading="loading" 
        />
      </div>
      <div class="col-span-12 lg:col-span-7 flex flex-col">
        <SharedCourseProgressPanel 
          :students="students"
          :selected-student-id="selectedStudentId"
          :courses="courses"
          :loading="loading"
          @student-change="handleStudentChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.teacher-dashboard {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.teacher-dashboard__header {
  margin-bottom: 2rem;
}

.teacher-dashboard__title {
  font-size: 24px;
  font-weight: 700;
  color: #2d2d2d;
  margin: 0 0 8px 0;
}

.teacher-dashboard__subtitle {
  font-size: 15px;
  color: #666;
  margin: 0;
}

.teacher-dashboard__panels {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 2rem;
}

@media (max-width: 1024px) {
  .teacher-dashboard__panels {
    display: flex;
    flex-direction: column;
  }
}
</style>

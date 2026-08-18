<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import ChildrenTable from '@/components/dashboard/ChildrenTable.vue'
import AddChildForm from '@/components/forms/AddChildForm.vue'
import ParentActivityPanel from '@/components/dashboard/ParentActivityPanel.vue'
import ParentCourseProgressPanel from '@/components/dashboard/ParentCourseProgressPanel.vue'
import ScreeningResultPanel from '@/components/dashboard/ScreeningResultPanel.vue'
import { useDashboard } from '@/composable/useDashboard'
import type { AddChildPayload, ChildStatus } from '@/types/child.types'
import type { ScreeningPayload, ScreeningUIState } from '@/types/screening.types'
import EmptyChildrenBanner from '@/components/dashboard/EmptyChildrenBanner.vue'
import ParentScreeningForm from '@/components/forms/ParentScreeningForm.vue'

import { useDashboardOverlay } from '@/composable/useDashboardOverlay'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composable/useAuth'

import DailyReminderBanner from '@/components/dashboard/DailyReminderBanner.vue'
import BaseButton from '@/components/shared/button/BaseButton.vue'
import ConfirmModal from '@/components/shared/modal/ConfirmModal.vue'

const router = useRouter()

const {
  user,
  loading,
  childRecords,
  lembagaList,
  hasChildren,
  activities,
  courses,
  selectedChildId,

  initialize,
  selectChild,
  addChild,
  updateChild,
  uploadChildAvatar,
  deleteChild, // <-- Use the new delete function
  updateScreeningUIState,
  getScreeningQuestions, // <-- Use from composable
  submitScreening, // <-- Use from composable
} = useDashboard()

const overlay = useDashboardOverlay()
const editingChildAvatarUrl = computed(() => {
  const id = overlay.addChildData.value?._id
  return childRecords.value.find((r) => r._id === id)?.avatar ?? ''
})
async function handleChildAvatarChange(file: File) {
  const id = overlay.addChildData.value?._id
  if (!id) return
  await uploadChildAvatar(id, file)
}
const editingChild = computed(() =>
  childRecords.value.find((r) => r._id === overlay.addChildData.value?._id),
)

onMounted(initialize)
async function handleSubmit(payload: AddChildPayload) {
  overlay.loading.value = true
  try {
    if (overlay.addChildData.value?._id) {
      await updateChild(overlay.addChildData.value._id, payload)
    } else {
      await addChild(payload)
    }
    overlay.close()
  } finally {
    overlay.loading.value = false
  }
}

function handleEdit(id: string) {
  const record = childRecords.value.find((r: { _id: string }) => r._id === id)
  if (!record) return
  overlay.openEditChild(id, {
    fullName: record.fullName,
    dateOfBirth: record.dateOfBirth ?? '',
    therapyType: record.institutionId ? 'lembaga_sekolah' : 'individu',
    applicationStatus: record.applicationStatus,
    institutionId: record.institutionId,
  })
}

async function handleDelete(id: string) {
  await deleteChild(id)
}

async function handleScreeningAction(id: string, action: ScreeningUIState) {
  if (action === 'disable') return

  if (action === 'lihat_hasil') {
    overlay.openResult(id)
    return
  }

  if (action === 'anak') {
    router.push(`/screening/${id}/anak`) // dedicated page
    return
  }

  overlay.loading.value = true
  const questions = await getScreeningQuestions(action)
  overlay.loading.value = false
  overlay.openScreening(id, action, questions)
}

async function handleScreeningSubmit(payload: ScreeningPayload) {
  overlay.loading.value = true
  try {
    await submitScreening(payload)
    updateScreeningUIState(payload.childId, 'lihat_hasil')
    overlay.close()
  } finally {
    overlay.loading.value = false
  }
}

const props = defineProps<{
  date?: string // ISO string, defaults to today
}>()
const formattedDate = computed(() => {
  const d = props.date ? new Date(props.date) : new Date()
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
})
</script>

<template>
  <div class="dashboard">
    <main class="dashboard__main">
      <Transition name="fade">
        <AddChildForm
          v-if="overlay.mode.value === 'add_child' || overlay.mode.value === 'edit_child'"
          :lembaga-list="lembagaList"
          :loading="overlay.loading.value"
          :initial-data="overlay.addChildData.value?.data"
          :show-avatar-edit="
            overlay.mode.value === 'edit_child' && editingChild?.applicationStatus === 'diterima'
          "
          @submit="handleSubmit"
          @cancel="overlay.close()"
          :child-avatar-url="editingChildAvatarUrl"
          @avatar-change="handleChildAvatarChange"
        />
      </Transition>

      <Transition name="fade">
        <ParentScreeningForm
          v-if="overlay.mode.value === 'screening' && overlay.screeningData.value"
          :child-id="overlay.screeningData.value.childId"
          :screening-type="overlay.screeningData.value.type"
          :questions="overlay.screeningData.value.questions"
          :loading="overlay.loading.value"
          @submit="handleScreeningSubmit"
          @cancel="overlay.close()"
        />
      </Transition>

      <Transition name="fade">
        <ScreeningResultPanel
          v-if="overlay.mode.value === 'result' && overlay.resultData.value"
          :child-id="overlay.resultData.value.childId"
          :child-name="
            childRecords.find((r: { _id: string }) => r._id === overlay.resultData.value!.childId)
              ?.fullName
          "
          @back="overlay.close()"
          @save="overlay.close()"
        />
      </Transition>

      <Transition name="fade">
        <div
          v-if="overlay.mode.value === 'none'"
          class="dashboard__content"
        >
          <div class="dashboard__header">
            <div>
              <h1 class="dashboard__title">Selamat datang {{ user?.name ?? '...' }}</h1>
              <p class="dashboard__subtitle">
                {{
                  hasChildren
                    ? `${childRecords.length} anak terdaftar`
                    : 'Anda belum memiliki data Anak'
                }}
              </p>
            </div>
            <div class="dashboard__header-right">
              <DailyReminderBanner />

              <div class="dashboard__date-chip">{{ formattedDate }}</div>
            </div>
          </div>

          <EmptyChildrenBanner
            v-if="!hasChildren && !loading"
            class="parent-dashboard__empty"
            @add-child="overlay.openAddChild()"
          />

          <div class="dashboard__panels">
            <ParentCourseProgressPanel
              :children="childRecords"
              :selected-child-id="selectedChildId"
              :courses="courses"
              :loading="loading"
              @child-change="selectChild"
            />
            <ParentActivityPanel :activities="activities" :loading="loading" />
          </div>
        </div>
      </Transition>
    </main>
  </div>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  padding-left: 2rem;
  padding-right: 2rem;

  background: var(--color-background);
  font-family: 'Inter', system-ui, sans-serif;
}

.dashboard__header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.dashboard__date-chip {
  background: #ede8fa;
  color: var(--color-primary);
  border-radius: 10px;
  padding: 8px 16px;
  font-size: calc(13px * var(--text-scale, 1));
  font-weight: 600;
}

.dashboard__main {
  max-width: 90%;
  margin: 0 auto;
  padding: 2rem 2rem 3rem;
}

.dashboard__content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dashboard__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.dashboard__title {
  font-size: calc(20px * var(--text-scale, 1));
  font-weight: 700;
  color: var(--color-text-dark);
  margin: 0 0 4px;
}

.dashboard__subtitle {
  font-size: calc(14px * var(--text-scale, 1));
  color: var(--color-text-light);
  margin: 0;
}

.dashboard__add-btn {
  padding: 10px 20px;
  background: var(--color-primary);
  border-radius: var(--radius-md);
  transition: background var(--transition-base);
  color: #fff;
  border: none;

  font-size: calc(14px * var(--text-scale, 1));
  font-weight: 600;
  cursor: pointer;
}

.dashboard__add-btn:hover {
  background: var(--color-primary-light);
}

.dashboard__panels {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

@media (max-width: 768px) {
  .dashboard__panels {
    flex-direction: column;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

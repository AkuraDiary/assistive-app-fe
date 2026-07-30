<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDashboard } from '@/composable/useDashboard'
import { useDashboardOverlay } from '@/composable/useDashboardOverlay'
import ChildrenTable from '@/components/dashboard/ChildrenTable.vue'
import ParentApplicationModal from '@/components/dashboard/ParentApplicationModal.vue'
import AddChildForm from '@/components/forms/AddChildForm.vue'
import type { AddChildPayload } from '@/types/child.types'

const router = useRouter()
const dashboard = useDashboard()
const overlay = useDashboardOverlay()

const showAppModal = ref(false)
const selectedAppChildId = ref<string | null>(null)

const selectedAppChild = computed(
  () => dashboard.childRecords.value.find((c) => c._id === selectedAppChildId.value) || null
)
const selectedAppInstitution = computed(
  () => dashboard.lembagaList.value.find((l) => l._id === selectedAppChild.value?.institutionId) || null
)

function handleLihatCourse(id: string) {
  dashboard.selectChild(id)
}

function handleLihatPengajuan(id: string) {
  selectedAppChildId.value = id
  showAppModal.value = true
}

function handleEdit(id: string) {
  const record = dashboard.childRecords.value.find((r) => r._id === id)
  if (!record) return
  overlay.openEditChild(id, {
    fullName: record.fullName,
    dateOfBirth: record.dateOfBirth ?? '',
    gender: record.gender,
    therapyType: record.institutionId ? 'lembaga_sekolah' : 'individu',
    institutionId: record.institutionId,
    hasDiagnosis: record.hasDiagnosis,
    applicationStatus: record.applicationStatus,
  })
}

function handleTambahAnak() {
  overlay.openAddChild()
}

async function handleAddChildSubmit(payload: AddChildPayload) {
  overlay.loading.value = true
  try {
    if (overlay.addChildData.value?._id) {
      await dashboard.updateChild(overlay.addChildData.value._id, payload)
    } else {
      await dashboard.addChild(payload)
    }
    overlay.close()
  } finally {
    overlay.loading.value = false
  }
}

async function handleAvatarChange(file: File) {
  const id = overlay.addChildData.value?._id
  if (!id) return
  await dashboard.uploadChildAvatar(id, file)
}

const editingChildAvatarUrl = computed(() => {
  const id = overlay.addChildData.value?._id
  if (!id) return ''
  return dashboard.childRecords.value.find((r) => r._id === id)?.avatar ?? ''
})
</script>

<template>
  <div class="pcs">
    <div class="pcs__header">
      <h1 class="pcs__title">Daftar Anak</h1>
      <button class="pcs__add-btn" @click="handleTambahAnak">Tambah Data Anak</button>
    </div>

    <ChildrenTable
      :records="dashboard.childRecords.value"
      :institutions="dashboard.lembagaList.value"
      :loading="dashboard.loading.value"
      @edit="handleEdit"
      @lihat-course="handleLihatCourse"
      @lihat-pengajuan="handleLihatPengajuan"
    />

    <ParentApplicationModal 
      :show="showAppModal"
      :child="selectedAppChild"
      :institution="selectedAppInstitution"
      @close="showAppModal = false"
    />

    <Transition name="fade">
      <div v-if="overlay.mode.value === 'add_child' || overlay.mode.value === 'edit_child'" class="pcs__overlay">
        <AddChildForm
          :lembaga-list="dashboard.lembagaList.value"
          :loading="overlay.loading.value"
          :initial-data="overlay.addChildData.value?.data"
          :show-avatar-edit="
            overlay.mode.value === 'edit_child' && 
            dashboard.childRecords.value.find(r => r._id === overlay.addChildData.value?._id)?.applicationStatus === 'diterima'
          "
          :child-avatar-url="editingChildAvatarUrl"
          @submit="handleAddChildSubmit"
          @cancel="overlay.close()"
          @avatar-change="handleAvatarChange"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.pcs {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.pcs__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pcs__title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.pcs__add-btn {
  background-color: #ff4d8d;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.pcs__add-btn:hover {
  background-color: #e63e7a;
}

.pcs__overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--color-background);
  z-index: 100;
  overflow-y: auto;
  padding: 40px;
}
</style>

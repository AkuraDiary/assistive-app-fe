import { ref, computed } from 'vue'
import type { ChildRecord, AddChildPayload, Lembaga } from '@/types/child.types'
import { childService } from '@/services/child.service'

const childRecords = ref<ChildRecord[]>([])
const lembagaList = ref<Lembaga[]>([])

export function useChildren() {
  const hasChildren = computed(() => childRecords.value.length > 0)

  async function fetchChildren() {
    const [recordsRes, lembagaRes] = await Promise.all([
      childService.getChildRecords(),
      childService.getLembagaList(),
    ])
    if (recordsRes.success && recordsRes.data) childRecords.value = recordsRes.data
    if (lembagaRes.success && lembagaRes.data) lembagaList.value = lembagaRes.data
  }

  async function addChild(payload: AddChildPayload) {
    const res = await childService.addChildRecord(payload)
    if (res.success && res.data) {
      childRecords.value.push(res.data)
      return res.data
    }
    throw new Error(res.message || 'Failed to add child')
  }

  async function uploadChildAvatar(id: string, file: File) {
    const res = await childService.uploadChildAvatar(id, file)
    if (res.success && res.data) {
      const index = childRecords.value.findIndex((r) => r._id === id)
      if (index !== -1 && childRecords.value[index]) {
        childRecords.value[index].avatar = res.data
      }
    }
  }

  async function updateChild(id: string, payload: AddChildPayload) {
    const res = await childService.updateChildRecord(id, payload)
    if (res.success && res.data) {
      const index = childRecords.value.findIndex((r) => r._id === id)
      if (index !== -1) childRecords.value[index] = res.data
    }
  }

  async function deleteChild(id: string) {
    const res = await childService.deleteChildRecord(id)
    if (res.success) {
      childRecords.value = childRecords.value.filter((r) => r._id !== id)
    }
  }

  return {
    childRecords,
    lembagaList,
    hasChildren,
    fetchChildren,
    addChild,
    uploadChildAvatar,
    updateChild,
    deleteChild,
  }
}

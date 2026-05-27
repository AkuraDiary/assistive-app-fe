import { ref, computed } from 'vue'
import type { ChildRecord, AddChildPayload, Lembaga } from '@/types/child.types'
import { childService } from '@/services/child.service'

const childRecords = ref<ChildRecord[]>([])
const lembagaList = ref<Lembaga[]>([])

export function useChildren() {
  const hasChildren = computed(() => childRecords.value.length > 0)

  async function fetchChildren() {
    const [records, lembaga] = await Promise.all([
      childService.getChildRecords(),
      childService.getLembagaList(),
    ])
    childRecords.value = records
    lembagaList.value = lembaga
  }

  async function addChild(payload: AddChildPayload) {
    const record = await childService.addChildRecord(payload)
    childRecords.value.push(record)
    return record
  }

  async function updateChild(id: string, payload: AddChildPayload) {
    const record = await childService.updateChildRecord(id, payload)
    const index = childRecords.value.findIndex((r) => r.id === id)
    if (index !== -1) childRecords.value[index] = record
  }

  async function deleteChild(id: string) {
    await childService.deleteChildRecord(id)
    childRecords.value = childRecords.value.filter((r) => r.id !== id)
  }

  return {
    childRecords,
    lembagaList,
    hasChildren,
    fetchChildren,
    addChild,
    updateChild,
    deleteChild,
  }
}
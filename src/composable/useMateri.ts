import { ref, computed } from 'vue'
import type { MateriContent } from '@/types/course.types'

const materiList = ref<MateriContent[]>([])
const currentIndex = ref(0)

export function useMateri() {
  function setMateri(list: MateriContent[]) {
    materiList.value = list
    currentIndex.value = 0
  }

  const currentMateri = computed(() => materiList.value[currentIndex.value] ?? null)
  const isFirst = computed(() => currentIndex.value === 0)
  const isLast = computed(() => currentIndex.value === materiList.value.length - 1)

  function prev() { if (!isFirst.value) currentIndex.value-- }
  function next() { if (!isLast.value) currentIndex.value++ }

  return {
    materiList,
    currentMateri,
    currentIndex,
    isFirst,
    isLast,
    setMateri,
    prev,
    next,
  }
}
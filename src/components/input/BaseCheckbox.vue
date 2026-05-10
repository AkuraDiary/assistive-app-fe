<script setup lang="ts">
interface Props {
  modelValue?: boolean
  label?: string
  disabled?: boolean
}

defineProps<Props>()

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <label class="inline-flex items-center gap-2 cursor-pointer select-none">
    <input
      type="checkbox"
      class="peer hidden"
      :checked="modelValue"
      :disabled="disabled"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />

    <div
      class="w-4 h-4 rounded border border-neutral-400 transition-all peer-checked:bg-black peer-checked:border-black peer-disabled:opacity-50"
    />

    <span class="text-sm">
      {{ label }}
    </span>
  </label>
</template>

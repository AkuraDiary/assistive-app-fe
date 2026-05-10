<script setup lang="ts">
interface Props {
  modelValue?: string | number
  value?: string | number
  label?: string
  name?: string
  disabled?: boolean
}

defineProps<Props>()

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <label class="inline-flex items-center gap-2 cursor-pointer select-none">
    <input
      type="radio"
      class="peer sr-only"
      :name="name"
      :value="value"
      :checked="modelValue === value"
      :disabled="disabled"
      @change="emit('update:modelValue', value)"
    />

    <span class="text-sm">
      {{ label }}
    </span>

    <div
      class="flex items-center justify-center w-4 h-4 rounded-full border border-neutral-400 transition-all peer-checked:bg-black peer-checked:border-black"
    >
      <div
        class="w-2 h-2 rounded-full bg-black scale-0 transition-all duration-200 peer-checked:scale-100"
      />
    </div>
  </label>
</template>

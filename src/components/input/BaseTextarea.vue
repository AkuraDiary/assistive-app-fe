<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '@/lib/ui'

interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  rows?: number
  disabled?: boolean
  error?: string
  hint?: string
  resize?: boolean
}

const props = withDefaults(
  defineProps<Props>(),
  {
    rows: 4,
    resize: true,
  }
)

const emit = defineEmits([
  'update:modelValue',
])

const classes = computed(() => [
  'w-full px-3 py-2 text-sm',
  'bg-white text-black',
  'placeholder:text-neutral-400',

  ui.border,
  ui.radius,
  ui.transition,
  ui.focus,
  ui.disabled,

  !props.resize && 'resize-none',

  props.error &&
    'border-red-500',
])
</script>

<template>
  <div class="flex flex-col gap-1">
    <label
      v-if="label"
      :class="ui.label"
    >
      {{ label }}
    </label>

    <textarea
      :rows="rows"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="classes"
      @input="
        emit(
          'update:modelValue',
          ($event.target as HTMLTextAreaElement).value
        )
      "
    />

    <p
      v-if="hint && !error"
      :class="ui.hint"
    >
      {{ hint }}
    </p>

    <p
      v-if="error"
      :class="ui.error"
    >
      {{ error }}
    </p>
  </div>
</template>
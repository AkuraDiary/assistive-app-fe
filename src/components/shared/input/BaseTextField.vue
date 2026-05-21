<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'
import { ui } from '@/lib/ui'

interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  type?: string
  error?: string
  disabled?: boolean
  hint?: string
  border?: string
  clearable?: boolean
  color?: 'primary' | 'secondary' | 'ternary'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  color: 'primary',
})

const emit = defineEmits(['update:modelValue'])

const slots = useSlots()

const showPassword = ref(false)

const actualType = computed(() => {
  if (props.type !== 'password') {
    return props.type
  }

  return showPassword.value ? 'text' : 'password'
})

const hasLeading = computed(() => !!slots.leading)

const classes = computed(() => [
  'w-full border-primary bg-white',
  'text-sm',
  'placeholder:text-neutral-400',

  hasLeading.value ? 'pl-10 pr-3' : 'px-3',

  props.type === 'password' || props.clearable ? 'pr-10' : '',

  ui.fieldHeight,
  ui.radius,
  ui.transition,
  ui.focus,
  ui.disabled,

  ui.variants[props.color].input,
  props.border,
  props.error && 'border-red-500 focus:ring-red-200',
])
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" :class="ui.label">
      {{ label }}
    </label>

    <div class="relative">
      <!-- LEADING -->
      <div v-if="$slots.leading" class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
        <slot name="leading" />
      </div>

      <input
        :value="modelValue"
        :type="actualType"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="classes"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />

      <!-- PASSWORD -->
      <button
        v-if="type === 'password'"
        type="button"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
        @click="showPassword = !showPassword"
      >
        <Eye v-if="!showPassword" class="w-4 h-4" />

        <EyeOff v-else class="w-4 h-4" />
      </button>

      <!-- CLEAR -->
      <button
        v-else-if="clearable && modelValue"
        type="button"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
        @click="emit('update:modelValue', '')"
      >
        ✕
      </button>
    </div>

    <p v-if="hint && !error" :class="ui.hint">
      {{ hint }}
    </p>

    <p v-if="error" :class="ui.error">
      {{ error }}
    </p>
  </div>
</template>

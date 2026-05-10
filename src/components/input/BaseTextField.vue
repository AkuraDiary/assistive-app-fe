<script setup lang="ts">
import { computed, ref } from 'vue'
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
  clearable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
})

const emit = defineEmits(['update:modelValue'])

const showPassword = ref(false)

const actualType = computed(() => {
  if (props.type !== 'password') {
    return props.type
  }

  return showPassword.value ? 'text' : 'password'
})

const classes = computed(() => [
  'w-full border border-neutral-300',
  'px-3 text-sm bg-white',
  ui.fieldHeight,
  ui.radius,
  ui.transition,
  ui.focus,
  ui.disabled,

  props.error && 'border-red-500',
])
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium">
      {{ label }}
    </label>

    <div class="relative">
      <input
        :value="modelValue"
        :type="actualType"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="classes"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />

      <!-- PASSWORD TOGGLE -->
      <button
        v-if="type === 'password'"
        type="button"
        class="absolute right-3 top-1/2 -translate-y-1/2"
        @click="showPassword = !showPassword"
      >
        <Eye v-if="!showPassword" class="w-4 h-4" />

        <EyeOff v-else class="w-4 h-4" />
      </button>

      <!-- CLEAR -->
      <button
        v-if="clearable && modelValue"
        type="button"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
        @click="emit('update:modelValue', '')"
      >
        ✕
      </button>
    </div>

    <p v-if="hint && !error" class="text-xs text-neutral-500">
      {{ hint }}
    </p>

    <p v-if="error" class="text-xs text-red-500">
      {{ error }}
    </p>
  </div>
</template>

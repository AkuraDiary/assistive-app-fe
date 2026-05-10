<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '@/lib/ui'

interface Props {
  variant?: 'solid' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  fullWidth?: boolean
}

const props = withDefaults(
  defineProps<Props>(),
  {
    variant: 'solid',
    size: 'md',
  }
)

const classes = computed(() => [
  'inline-flex items-center justify-center',
  'gap-2 font-medium',
  ui.radius,
  ui.transition,
  ui.disabled,

  props.fullWidth && 'w-full',

  props.size === 'sm' &&
    'h-8 px-3 text-sm',

  props.size === 'md' &&
    'h-[35px] px-4 text-sm',

  props.size === 'lg' &&
    'h-11 px-5 text-base',

  props.variant === 'solid' &&
    'bg-black text-white hover:opacity-90',

  props.variant === 'outline' &&
    'border border-neutral-300 bg-white hover:bg-neutral-50',

  props.variant === 'ghost' &&
    'hover:bg-neutral-100',
])
</script>

<template>
  <button
    :disabled="disabled"
    :class="classes"
  >
    <slot name="leading" />

    <slot />

    <slot name="trailing" />
  </button>
</template>
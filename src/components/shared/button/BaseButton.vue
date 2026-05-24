<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '@/lib/ui'

interface Props {
  variant?: 'solid' | 'outline' | 'ghost'
  color?: 'primary' | 'secondary' | 'ternary' | 'warning' | 'info' | 'success' | 'error'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(
  defineProps<Props>(),
  {
    variant: 'solid',
    color: 'primary',
    size: 'md',
    type: 'button',
  }
)

const classes = computed(() => [
  'inline-flex items-center justify-center',
  'gap-2 font-semibold',
  'shadow-sm',

  ui.radius,
  ui.transition,
  ui.disabled,

  props.fullWidth && 'w-full',

  props.size === 'sm' &&
    'h-9 px-4 text-sm',

  props.size === 'md' &&
    'h-11 px-5 text-sm',

  props.size === 'lg' &&
    'h-12 px-6 text-base',

  ui.variants[props.color][props.variant],
])
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="classes"
  >
    <slot name="leading" />

    <slot />

    <slot name="trailing" />
  </button>
</template>
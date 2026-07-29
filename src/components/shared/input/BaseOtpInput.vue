<script setup lang="ts">
/**
 * BaseOtpInput.vue
 * Reusable N-digit OTP input (default 6).
 * Emits a complete string via `update:modelValue` on every keystroke,
 * and a `complete` event when all digits are filled.
 */
import { ref, watch, nextTick } from 'vue'

interface Props {
  modelValue?: string
  /** Number of digit boxes (default 6) */
  length?: number
  /** Disable all inputs */
  disabled?: boolean
  /** Show error ring */
  hasError?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  length: 6,
  disabled: false,
  hasError: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'complete', value: string): void
}>()

// Internal array of single characters
const digits = ref<string[]>(Array(props.length).fill(''))
const inputRefs = ref<HTMLInputElement[]>([])

// Sync incoming modelValue → digits (e.g. for clearing from parent)
watch(
  () => props.modelValue,
  (val) => {
    const chars = (val ?? '').split('').slice(0, props.length)
    digits.value = [...chars, ...Array(props.length - chars.length).fill('')]
  },
  { immediate: true },
)

function emitCurrent() {
  const joined = digits.value.join('')
  emit('update:modelValue', joined)
  if (joined.length === props.length && !digits.value.includes('')) {
    emit('complete', joined)
  }
}

function onInput(index: number, event: Event) {
  const input = event.target as HTMLInputElement
  const char = input.value.replace(/\D/g, '').slice(-1) // digits only, last char
  digits.value[index] = char
  input.value = char // keep DOM in sync

  emitCurrent()

  // Advance focus
  if (char && index < props.length - 1) {
    nextTick(() => inputRefs.value[index + 1]?.focus())
  }
}

function onKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace') {
    if (digits.value[index]) {
      // Clear current cell first
      digits.value[index] = ''
      emitCurrent()
    } else if (index > 0) {
      // Move back and clear previous
      digits.value[index - 1] = ''
      emitCurrent()
      nextTick(() => inputRefs.value[index - 1]?.focus())
    }
    event.preventDefault()
  } else if (event.key === 'ArrowLeft' && index > 0) {
    inputRefs.value[index - 1]?.focus()
  } else if (event.key === 'ArrowRight' && index < props.length - 1) {
    inputRefs.value[index + 1]?.focus()
  }
}

function onPaste(event: ClipboardEvent) {
  event.preventDefault()
  const text = event.clipboardData?.getData('text') ?? ''
  const cleaned = text.replace(/\D/g, '').slice(0, props.length)
  cleaned.split('').forEach((char, i) => {
    digits.value[i] = char
  })
  emitCurrent()
  // Focus last filled or last box
  const focusIndex = Math.min(cleaned.length, props.length - 1)
  nextTick(() => inputRefs.value[focusIndex]?.focus())
}

/** Expose reset for parent usage: otpRef.value?.reset() */
function reset() {
  digits.value = Array(props.length).fill('')
  emitCurrent()
  nextTick(() => inputRefs.value[0]?.focus())
}

defineExpose({ reset })
</script>

<template>
  <div class="flex gap-3 justify-center" @paste="onPaste">
    <input
      v-for="(digit, index) in digits"
      :key="index"
      :ref="(el) => { if (el) inputRefs[index] = el as HTMLInputElement }"
      type="text"
      inputmode="numeric"
      maxlength="1"
      :value="digit"
      :disabled="disabled"
      :aria-label="`Digit ${index + 1}`"
      class="
        h-[72px] w-[72px] rounded-xl border-2 bg-white text-center text-2xl font-bold
        text-neutral-800 outline-none transition-all duration-150
        focus:border-primary focus:shadow-[0_0_0_3px_rgba(139,115,246,0.15)]
        disabled:cursor-not-allowed disabled:opacity-50
      "
      :class="[
        hasError
          ? 'border-red-400'
          : digit
            ? 'border-primary bg-white'
            : 'border-gray-200',
      ]"
      @input="onInput(index, $event)"
      @keydown="onKeydown(index, $event)"
    />
  </div>
</template>
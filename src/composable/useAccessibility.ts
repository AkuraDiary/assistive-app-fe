import { ref, watch, computed } from 'vue'

export type FontSize = 'sm' | 'md' | 'lg'

const fontSize = ref<FontSize>((localStorage.getItem('a11y_fontSize') as FontSize) ?? 'md')
const dyslexiaFont = ref<boolean>(localStorage.getItem('a11y_dyslexia') === 'true')

watch(fontSize, (v) => localStorage.setItem('a11y_fontSize', v))
watch(dyslexiaFont, (v) => localStorage.setItem('a11y_dyslexia', String(v)))

const fontSizeClass = computed(() => ({
  sm: 'a11y--font-sm',
  md: 'a11y--font-md',
  lg: 'a11y--font-lg',
}[fontSize.value]))

const dyslexiaClass = computed(() => dyslexiaFont.value ? 'a11y--dyslexia' : '')

export function useAccessibility() {
  function increase() {
    if (fontSize.value === 'sm') fontSize.value = 'md'
    else if (fontSize.value === 'md') fontSize.value = 'lg'
  }
  function decrease() {
    if (fontSize.value === 'lg') fontSize.value = 'md'
    else if (fontSize.value === 'md') fontSize.value = 'sm'
  }
  function toggleDyslexia() {
    dyslexiaFont.value = !dyslexiaFont.value
  }

  return { fontSize, dyslexiaFont, fontSizeClass, dyslexiaClass, increase, decrease, toggleDyslexia }
}
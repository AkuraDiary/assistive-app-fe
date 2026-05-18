/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, computed, type Ref } from 'vue'

export interface ValidationRule {
  (value: any): string | true
}

export interface UseFormReturn<T extends Record<string, any>> {
  form: Ref<T>
  errors: Ref<Record<string, string | undefined>>
  isLoading: Ref<boolean>
  isFormValid: any
  validateField: (fieldName: keyof T) => boolean
  validateForm: () => boolean
  resetForm: () => void
  setFieldError: (fieldName: keyof T, error: string) => void
  clearFieldError: (fieldName: keyof T) => void
}

export function useForm<T extends Record<string, any>>(
  initialState: T,
  validationRules?: Record<keyof T, ValidationRule[]>
): UseFormReturn<T> {
  const form = ref(initialState) as Ref<T>
  const errors = ref<Record<string, string | undefined>>({})
  const isLoading = ref(false)

  const isFormValid = computed(() => {
    return Object.values(form.value).every((value) => {
      if (typeof value === 'string') return value.trim().length > 0
      return !!value
    }) && Object.values(errors.value).every((error) => !error)
  })

  const validateField = (fieldName: keyof T): boolean => {
    const rules = validationRules?.[fieldName]
    if (!rules) return true

    const value = form.value[fieldName]
    for (const rule of rules) {
      const result = rule(value)
      if (result !== true) {
        errors.value[fieldName as string] = result
        return false
      }
    }

    errors.value[fieldName as string] = undefined
    return true
  }

  const validateForm = (): boolean => {
    let isValid = true

    Object.keys(form.value).forEach((fieldName) => {
      if (!validateField(fieldName as keyof T)) {
        isValid = false
      }
    })

    return isValid
  }

  const resetForm = () => {
    form.value = { ...initialState }
    errors.value = {}
  }

  const setFieldError = (fieldName: keyof T, error: string) => {
    errors.value[fieldName as string] = error
  }

  const clearFieldError = (fieldName: keyof T) => {
    errors.value[fieldName as string] = undefined
  }

  return {
    form,
    errors,
    isLoading,
    isFormValid,
    validateField,
    validateForm,
    resetForm,
    setFieldError,
    clearFieldError,
  }
}
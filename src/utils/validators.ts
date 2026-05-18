/* eslint-disable @typescript-eslint/no-explicit-any */
export const validators = {
  required:
    (fieldName: string = 'Field') =>
    (value: string) => {
      return value?.trim() ? true : `${fieldName} harus diisi`
    },

  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value) ? true : 'Format email tidak valid'
  },

  minLength:
    (min: number, fieldName: string = 'Field') =>
    (value: string) => {
      return value?.length >= min ? true : `${fieldName} minimal ${min} karakter`
    },

  maxLength:
    (max: number, fieldName: string = 'Field') =>
    (value: string) => {
      return value?.length <= max ? true : `${fieldName} maksimal ${max} karakter`
    },

  username: (value: string) => {
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return 'Username hanya boleh huruf, angka, dan underscore'
    }
    return true
  },

  phone: (value: string) => {
    const phoneRegex = /^\d{10,12}$/
    const digitsOnly = value.replace(/\D/g, '')
    return phoneRegex.test(digitsOnly) ? true : 'Nomor telepon tidak valid'
  },

  password: (value: string) => {
    if (value.length < 8) {
      return 'Password minimal 8 karakter'
    }
    return true
  },

  match:
    (otherValue: string, fieldName: string = 'Fields') =>
    (value: string) => {
      return value === otherValue ? true : `${fieldName} tidak cocok`
    },

  custom: (fn: (value: any) => boolean, errorMsg: string) => (value: any) => {
    return fn(value) ? true : errorMsg
  },
}

export type ValidatorFunction = (value: any) => string | true

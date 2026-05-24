export const ui = {
  radius: 'rounded-[14px]',

  transition: 'transition-all duration-200 ease-in-out',

  disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',

  fieldHeight: 'h-12',

  border: 'border border-neutral-300',

  focus: 'focus:outline-none focus:ring-4',

  label: 'text-sm font-semibold',

  hint: 'text-xs text-neutral-500',

  error: 'text-xs text-red-500',

  variants: {
    primary: {
      solid:
        'bg-[var(--color-primary)] text-white hover:brightness-95 focus:ring-[var(--color-primary-muted)]',
      outline:
        'border border-[var(--color-primary)] text-[var(--color-primary)] bg-white hover:bg-[var(--color-surface-primary)]',
      ghost: 'text-[var(--color-primary)] hover:bg-[var(--color-surface-primary)]',
      input: 'focus:border-[var(--color-primary)] focus:ring-[var(--color-primary-muted)]',
    },

    secondary: {
      solid:
        'bg-[var(--color-secondary)] text-white hover:brightness-95 focus:ring-[var(--color-secondary-lighter)]',
      outline:
        'border border-[var(--color-secondary)] text-[var(--color-secondary)] bg-white hover:bg-[var(--color-surface)]',
      ghost: 'text-[var(--color-secondary)] hover:bg-[var(--color-surface)]',
      input: 'focus:border-[var(--color-secondary)] focus:ring-[var(--color-secondary-lighter)]',
    },

    ternary: {
      solid:
        'bg-[var(--color-primary)] text-white hover:brightness-95 focus:ring-[var(--color-primary-muted)]',
      outline:
        'border border-[var(--color-primary)] text-[var(--color-primary)] bg-white hover:bg-[var(--color-surface-primary)]',
      ghost: 'text-[var(--color-primary)] hover:bg-[var(--color-surface-primary)]',
      input: 'focus:border-[var(--color-primary)] focus:ring-[var(--color-primary-muted)]',
    },

    warning: {
      solid:
        'bg-[var(--color-warning)] text-white hover:brightness-95 focus:ring-[var(--color-warning-light)]',
      outline:
        'border border-[var(--color-warning)] text-[var(--color-warning)] bg-white hover:bg-[var(--color-warning-light)]',
      ghost: 'text-[var(--color-warning)] hover:bg-[var(--color-warning-light)]',
      input: 'focus:border-[var(--color-warning)] focus:ring-[var(--color-warning-light)]',
    },

    info: {
      solid:
        'bg-[var(--color-info)] text-white hover:brightness-95 focus:ring-[var(--color-info-light)]',
      outline:
        'border border-[var(--color-info)] text-[var(--color-info)] bg-white hover:bg-[var(--color-info-light)]',
      ghost: 'text-[var(--color-info)] hover:bg-[var(--color-info-light)]',
      input: 'focus:border-[var(--color-info)] focus:ring-[var(--color-info-light)]',
    },

    success: {
      solid:
        'bg-[var(--color-success)] text-white hover:brightness-95 focus:ring-[var(--color-success-light)]',
      outline:
        'border border-[var(--color-success)] text-[var(--color-success)] bg-white hover:bg-[var(--color-success-light)]',
      ghost: 'text-[var(--color-success)] hover:bg-[var(--color-success-light)]',
      input: 'focus:border-[var(--color-success)] focus:ring-[var(--color-success-light)]',
    },

    error: {
      solid:
        'bg-[var(--color-error)] text-white hover:brightness-95 focus:ring-[var(--color-error-light)]',
      outline:
        'border border-[var(--color-error)] text-[var(--color-error)] bg-white hover:bg-[var(--color-error-light)]',
      ghost: 'text-[var(--color-error)] hover:bg-[var(--color-error-light)]',
      input: 'focus:border-[var(--color-error)] focus:ring-[var(--color-error-light)]',
    },
  },
}

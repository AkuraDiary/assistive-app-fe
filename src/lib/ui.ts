export const ui = {
  radius: 'rounded-[14px]',

  transition:
    'transition-all duration-200 ease-in-out',

  disabled:
    'disabled:opacity-50 disabled:cursor-not-allowed',

  fieldHeight: 'h-12',

  border:
    'border border-neutral-300',

  focus:
    'focus:outline-none focus:ring-4',

  label:
    'text-sm font-semibold',

  hint:
    'text-xs text-neutral-500',

  error:
    'text-xs text-red-500',

  variants: {
    primary: {
      solid:
        'bg-[#FF3C8A] text-white hover:brightness-95 focus:ring-[#FFB3D1]',

      outline:
        'border border-[#FF3C8A] text-[#FF3C8A] bg-white hover:bg-[#FFF0F6]',

      ghost:
        'text-[#FF3C8A] hover:bg-[#FFF0F6]',

      input:
        'focus:border-[#FF3C8A] focus:ring-[#FFB3D1]/40',
    },

    secondary: {
      solid:
        'bg-[#008BD8] text-white hover:brightness-95 focus:ring-[#8ED7FF]',

      outline:
        'border border-[#008BD8] text-[#008BD8] bg-white hover:bg-[#F0FAFF]',

      ghost:
        'text-[#008BD8] hover:bg-[#F0FAFF]',

      input:
        'focus:border-[#008BD8] focus:ring-[#8ED7FF]/40',
    },

    ternary: {
      solid:
        'bg-[#8B3DFF] text-white hover:brightness-95 focus:ring-[#DEC8FF]',

      outline:
        'border border-[#8B3DFF] text-[#8B3DFF] bg-white hover:bg-[#F7F1FF]',

      ghost:
        'text-[#8B3DFF] hover:bg-[#F7F1FF]',

      input:
        'focus:border-[#8B3DFF] focus:ring-[#DEC8FF]/40',
    },
  },
}
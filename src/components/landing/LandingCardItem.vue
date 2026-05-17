<script setup lang="ts">
interface Props {
  rotate?: string
  translate?: string
  z?: string
}

withDefaults(defineProps<Props>(), {
  rotate: '',
  translate: '',
  z: '',
})
</script>

<template>
  <div :class="['absolute', rotate, translate, z]">
    <div
      class="relative h-[320px] w-[230px] overflow-hidden rounded-[28px] border border-neutral-400 bg-gradient-to-br from-[#ECEAFB] via-[#E9EAF2] to-[#EFEFDF]"
    >
      <div class="absolute -bottom-32 -left-20 h-[420px] w-[420px] rounded-full bg-white/40" />
    </div>
  </div>
</template>

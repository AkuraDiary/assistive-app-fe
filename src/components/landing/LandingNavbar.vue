<script setup lang="ts">
const menus = [
  'Beranda',
  'Tentang',
  'Fitur',
  'Our Partners',
  'Program',
]
</script>

<template>
  <header
    class="
      flex
      items-center
      justify-between
      px-10
      py-8
    "
  >
    <!-- LOGO -->
    <div
      class="
        h-12
        w-12
        rounded-full
        bg-neutral-300
      "
    />

    <!-- NAVIGATION -->
    <nav
      class="
        flex
        items-center
        gap-2
        rounded-full
        border
        border-[#56BFF9]
        bg-[#8ED7FF]
        px-2
        py-2
      "
    >
      <button
        v-for="menu in menus"
        :key="menu"
        class="
          rounded-full
          px-5
          py-2
          text-sm
          font-medium
          text-neutral-700
          transition-all
          hover:bg-white/60
        "
        :class="
          menu === 'Beranda'
            ? 'bg-white shadow-sm'
            : ''
        "
      >
        {{ menu }}
      </button>
    </nav>

    <!-- ACTION -->
    <div class="flex items-center gap-3">
      <BaseButton
        variant="outline"
        color="primary"
      >
        MASUK
      </BaseButton>

      <BaseButton color="primary">
        DAFTAR
      </BaseButton>
    </div>
  </header>
</template>
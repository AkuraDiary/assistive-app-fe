<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
</script>

<template>
  <div class="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
    <!-- Left: Text Content -->
    <div class="text-center lg:text-left">
      <h1 class="text-5xl font-black tracking-tight text-black lg:text-6xl">
        Add the Title Text Here
      </h1>

      <p class="mt-8 text-lg leading-8 text-neutral-700 lg:text-xl">
        This is a space to welcome visitors to the site. Grab their attention with copy that clearly
        states what the site is about, and add an engaging image or video.
      </p>

      <div class="mt-10 flex flex-col gap-4 sm:flex-row lg:justify-start">
        <BaseButton color="primary" size="lg"> Coba demo gratis </BaseButton>

        <BaseButton variant="outline" color="primary" size="lg">
          Hubungi kami

          <template #trailing>
            <div class="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFB3D1]">
              <ArrowUpRight class="h-4 w-4" />
            </div>
          </template>
        </BaseButton>
      </div>
    </div>

    <!-- Right: Hero Image -->
    <div class="hidden lg:flex justify-center">
      <div
        class="relative h-[520px] w-full max-w-[450px] overflow-hidden rounded-[42px] bg-gradient-to-br from-[#ECEAFB] via-[#E9EAF2] to-[#EFEFDF] shadow-xl"
      >
        <!-- Decorative circle background -->
        <div class="absolute -bottom-40 -left-24 h-[700px] w-[700px] rounded-full bg-white/40" />

        <!-- Placeholder for hero image or illustration -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center">
            <div class="text-6xl text-white/20">📱</div>
            <p class="mt-4 text-white/30">Hero Image Placeholder</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

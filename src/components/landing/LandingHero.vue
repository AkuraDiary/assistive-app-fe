<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
</script>

<template>
  <div class="mx-auto flex max-w-7xl flex-col items-center justify-center">
    <div class="max-w-2xl text-center">
      <h1 class="text-5xl font-black tracking-tight text-black lg:text-6xl">
        Add the Title Text Here
      </h1>

      <p class="mt-8 text-lg leading-8 text-neutral-700 lg:text-xl">
        This is a space to welcome visitors to the site. Grab their attention with copy that clearly
        states what the site is about, and add an engaging image or video.
      </p>

      <!-- Changed lg:justify-start to justify-center to fix the button container -->
      <div class="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
        <BaseButton color="primary" size="lg"> Coba demo gratis </BaseButton>

        <BaseButton variant="outline" color="primary" size="lg">
          Hubungi kami
          <template #trailing>
            <div class="flex h-6 w-6 items-center justify-center rounded-full bg-primary-light">
              <ArrowUpRight class="h-4 w-4" />
            </div>
          </template>
        </BaseButton>
      </div>
    </div>
  </div>
</template>

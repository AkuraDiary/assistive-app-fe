<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
</script>

<template>
  <section
    class="
      mx-auto
      max-w-4xl
      text-center
    "
  >
    <h1
      class="
        text-6xl
        font-black
        tracking-tight
        text-black
      "
    >
      Add the Title Text Here
    </h1>

    <p
      class="
        mx-auto
        mt-8
        max-w-3xl
        text-xl
        leading-10
        text-neutral-700
      "
    >
      This is a space to welcome visitors
      to the site. Grab their attention
      with copy that clearly states
      what the site is about,
      and add an engaging image or video.
    </p>

    <div
      class="
        mt-10
        flex
        items-center
        justify-center
        gap-5
      "
    >
      <BaseButton
        color="primary"
        size="lg"
      >
        Coba demo gratis
      </BaseButton>

      <BaseButton
        variant="outline"
        color="primary"
        size="lg"
      >
        Hubungi kami

        <template #trailing>
          <div
            class="
              flex
              h-6
              w-6
              items-center
              justify-center
              rounded-full
              bg-[#FFB3D1]
            "
          >
            <ArrowUpRight
              class="h-4 w-4"
            />
          </div>
        </template>
      </BaseButton>
    </div>
  </section>
</template>
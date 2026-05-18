<script setup lang="ts"></script>

<template>
  <div class="min-h-screen bg-white px-6 py-10">
    <div class="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
      <!-- LEFT -->
      <div class="flex flex-col items-center justify-center">
        <slot name="left" />
      </div>

      <!-- RIGHT -->
      <div class="hidden lg:flex justify-center">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-white px-6 py-10">
    <div class="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
      <!-- LEFT -->
      <div class="flex flex-col items-center justify-center w-full">
        <slot name="left" />
      </div>

      <!-- RIGHT -->
      <div class="hidden lg:flex items-center justify-center w-full">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

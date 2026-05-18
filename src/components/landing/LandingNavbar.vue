<script setup lang="ts">
import { ref } from 'vue'
import { Menu, X } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

interface NavItem {
  label: string
  id: string
}

const navItems: NavItem[] = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'tentang', label: 'Tentang' },
  { id: 'fitur', label: 'Fitur' },
  { id: 'partners', label: 'Our Partners' },
  { id: 'program', label: 'Program' },
]

const activeNav = ref<string>('beranda')
const isMobileMenuOpen = ref(false)

const handleNavClick = (id: string) => {
  activeNav.value = id
  isMobileMenuOpen.value = false
  // TODO: Scroll to section or navigate via router
}

const handleLogin = () => {
  router.push('/login')
}

const handleRegister = () => {
  // TODO: Navigate to register page
  router.push('/register')
}
</script>

<template>
  <header class="flex items-center justify-between px-6 py-8 lg:px-10">
    <!-- Logo -->
    <div class="h-12 w-12 flex-shrink-0 rounded-full bg-neutral-300" />

    <!-- Navigation - Desktop -->
    <nav
      class="hidden items-center gap-2 rounded-full border border-[#56BFF9] bg-[#8ED7FF] px-2 py-2 lg:flex"
    >
      <button
        v-for="item in navItems"
        :key="item.id"
        class="rounded-full px-5 py-2 text-sm font-medium text-neutral-700 transition-all duration-200 hover:bg-white/60"
        :class="activeNav === item.id ? 'bg-white shadow-sm' : ''"
        @click="handleNavClick(item.id)"
      >
        {{ item.label }}
      </button>
    </nav>

    <!-- Mobile Menu Button -->
    <button
      class="lg:hidden"
      @click="isMobileMenuOpen = !isMobileMenuOpen"
    >
      <Menu v-if="!isMobileMenuOpen" class="h-6 w-6" />
      <X v-else class="h-6 w-6" />
    </button>

    <!-- Actions - Desktop -->
    <div class="hidden items-center gap-3 lg:flex">
      <BaseButton
        variant="outline"
        color="primary"
        @click="handleLogin"
      >
        MASUK
      </BaseButton>

      <BaseButton
        color="primary"
        @click="handleRegister"
      >
        DAFTAR
      </BaseButton>
    </div>

    <!-- Mobile Menu -->
    <div
      v-if="isMobileMenuOpen"
      class="absolute left-0 right-0 top-20 z-40 border-b border-[#56BFF9] bg-[#8ED7FF] p-4 shadow-lg lg:hidden"
    >
      <nav class="mb-4 flex flex-col gap-2">
        <button
          v-for="item in navItems"
          :key="item.id"
          class="rounded-lg px-4 py-2 text-left text-sm font-medium text-neutral-700 transition-all duration-200 hover:bg-white/60"
          :class="activeNav === item.id ? 'bg-white' : ''"
          @click="handleNavClick(item.id)"
        >
          {{ item.label }}
        </button>
      </nav>

      <div class="flex gap-2 border-t border-[#56BFF9] pt-4">
        <BaseButton
          variant="outline"
          color="primary"
          size="sm"
          full-width
          @click="handleLogin"
        >
          MASUK
        </BaseButton>

        <BaseButton
          color="primary"
          size="sm"
          full-width
          @click="handleRegister"
        >
          DAFTAR
        </BaseButton>
      </div>
    </div>
  </header>
</template>
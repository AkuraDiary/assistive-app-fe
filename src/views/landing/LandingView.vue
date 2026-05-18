<script setup lang="ts">
// Navigation structure is defined in LandingNavbar.vue
// This file just renders the sections with matching IDs
</script>

<template>
  <div class="w-full overflow-x-hidden bg-white">
    <!-- Navigation -->
    <LandingNavbar />

    <!-- Main Content -->
    <main class="w-full">
      <!-- Hero Section -->
      <section id="beranda" class="w-full bg-white px-6 py-8">
        <div class="mx-auto max-w-7xl">
          <LandingHero />
        </div>
      </section>

      <!-- Features Section -->
      <section id="fitur" class="w-full bg-white px-6 py-8">
        <LandingCards />
      </section>

      <!-- About Section -->
      <section id="tentang" class="w-full bg-white px-6 py-8">
        <div class="mx-auto max-w-4xl">
          <div class="text-center">
            <h2 class="text-4xl font-bold text-black lg:text-5xl">Tentang Kami</h2>
            <p class="mx-auto mt-6 max-w-3xl text-lg leading-8 text-neutral-700">
              Kami berkomitmen untuk memberikan solusi terbaik dalam dunia pendidikan. Dengan tim
              profesional dan teknologi terkini, kami siap membantu setiap pengguna mencapai tujuan
              mereka.
            </p>
          </div>
        </div>
      </section>

      <!-- Partners Section -->
      <section id="partners" class="w-full bg-white px-6 py-20 lg:py-32">
        <div class="mx-auto max-w-4xl">
          <h2 class="mb-16 text-center text-4xl font-bold text-black lg:text-5xl">Partner Kami</h2>

          <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div
              v-for="i in 4"
              :key="i"
              class="flex items-center justify-center rounded-lg border border-neutral-300 bg-white p-6"
            >
              <div class="h-20 w-20 rounded-lg bg-neutral-300" />
            </div>
          </div>
        </div>
      </section>

      <!-- Program Section -->
      <section id="program" class="w-full bg-white px-6 py-20 lg:py-32">
        <div class="mx-auto max-w-4xl">
          <h2 class="mb-16 text-center text-4xl font-bold text-black lg:text-5xl">Program Kami</h2>

          <div class="space-y-6">
            <div
              v-for="i in 3"
              :key="i"
              class="rounded-lg border border-neutral-300 bg-white p-8 shadow-sm"
            >
              <h3 class="text-2xl font-bold text-black">Program {{ i }}</h3>
              <p class="mt-2 text-neutral-700">
                Deskripsi lengkap program kami yang dirancang khusus untuk memenuhi kebutuhan Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section
        class="w-full bg-gradient-to-r from-[#008BD8] to-[#56BFF9] px-6 py-20 text-center lg:py-32"
      >
        <div class="mx-auto max-w-3xl">
          <h2 class="text-4xl font-bold text-white lg:text-5xl">Siap Memulai?</h2>
          <p class="mx-auto mt-4 max-w-2xl text-lg text-white/90">
            Bergabunglah dengan ribuan pengguna yang telah merasakan manfaat aplikasi kami
          </p>

          <div class="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <RouterLink to="/login">
              <BaseButton color="primary" size="lg" class="w-full sm:w-auto"> MASUK </BaseButton>
            </RouterLink>

            <RouterLink to="/register">
              <BaseButton variant="outline" color="primary" size="lg" class="w-full sm:w-auto">
                DAFTAR GRATIS
              </BaseButton>
            </RouterLink>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="w-full border-t border-neutral-300 bg-white px-6 py-16">
        <div class="mx-auto max-w-6xl">
          <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <!-- Brand -->
            <div>
              <div class="mb-4 h-12 w-12 rounded-full bg-neutral-300" />
              <p class="text-sm text-neutral-700">Solusi terbaik untuk pendidikan modern</p>
            </div>

            <!-- Links -->
            <div>
              <h4 class="mb-4 font-semibold text-black">Produk</h4>
              <ul class="space-y-2 text-sm text-neutral-700">
                <li><a href="#" class="hover:text-primary">Fitur</a></li>
                <li><a href="#" class="hover:text-primary">Harga</a></li>
                <li><a href="#" class="hover:text-primary">Keamanan</a></li>
              </ul>
            </div>

            <!-- Company -->
            <div>
              <h4 class="mb-4 font-semibold text-black">Perusahaan</h4>
              <ul class="space-y-2 text-sm text-neutral-700">
                <li><a href="#" class="hover:text-primary">Tentang</a></li>
                <li><a href="#" class="hover:text-primary">Blog</a></li>
                <li><a href="#" class="hover:text-primary">Karir</a></li>
              </ul>
            </div>

            <!-- Legal -->
            <div>
              <h4 class="mb-4 font-semibold text-black">Legal</h4>
              <ul class="space-y-2 text-sm text-neutral-700">
                <li><a href="#" class="hover:text-primary">Privasi</a></li>
                <li><a href="#" class="hover:text-primary">Terms</a></li>
                <li><a href="#" class="hover:text-primary">Kontak</a></li>
              </ul>
            </div>
          </div>

          <!-- Copyright -->
          <div class="mt-12 border-t border-neutral-300 pt-8 text-center text-sm text-neutral-700">
            <p>&copy; 2024 Assistive App. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  </div>
</template>

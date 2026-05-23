<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { ScreeningResult, CategoryScore } from '@/types/dashboard.types'
import { dashboardService } from '@/services/dashboard.service'
import BaseButton from '@/components/shared/button/BaseButton.vue'

const props = defineProps<{
  childId: string
  childName?: string
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'save', result: ScreeningResult): void
}>()

const result = ref<ScreeningResult | null>(null)
const isFetching = ref(true)

onMounted(async () => {
  const results = await dashboardService.getScreeningResult(props.childId)
  result.value = results[0] ?? null
  isFetching.value = false
})

// ── Donut chart via SVG ───────────────────────────────────────────────────────
const DONUT_R = 52
const DONUT_CX = 70
const DONUT_CY = 70
const CIRCUMFERENCE = 2 * Math.PI * DONUT_R

const CATEGORY_COLORS = ['#b8a9e8', '#7ec8b0', '#f4a0b0', '#89c4e8', '#f4c07a']

const totalScore = computed(() => result.value?.score ?? 0)

const segments = computed(
  (): Array<{ color: string; dash: string; offset: string; label: CategoryScore }> => {
    const cats = result.value?.categoryScores ?? []
    const total = cats.reduce((s, c) => s + c.score, 0) || 1
    let cumulative = 0
    return cats.map((cat, i) => {
      const fraction = cat.score / total
      const dash = `${(fraction * CIRCUMFERENCE).toFixed(2)} ${CIRCUMFERENCE}`
      const offset = `${-(cumulative * CIRCUMFERENCE).toFixed(2)}`
      cumulative += fraction
      return {
        color: CATEGORY_COLORS[i % CATEGORY_COLORS.length] ?? '#ccc',
        dash,
        offset,
        label: cat,
      }
    })
  },
)
</script>

<template>
  <div class="sr">
    <h1 class="sr__page-title">Hasil Screening Anak</h1>

    <div v-if="isFetching" class="sr__loading">
      <div class="sr__spinner" />
    </div>

    <template v-else-if="result">
      <div class="sr__top">
        <!-- Left: child info + donut -->
        <div class="sr__left">
          <!-- Child card -->
          <div class="sr__child-card">
            <div class="sr__avatar">
              <div>
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                  <circle cx="28" cy="28" r="27" stroke="#b8a9e8" stroke-width="2" />
                  <circle cx="28" cy="23" r="9" stroke="#b8a9e8" stroke-width="2" />
                  <path
                    d="M10 49c2.5-7 9-11 18-11s15.5 4 18 11"
                    stroke="#b8a9e8"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              </div>
              <div class="sr__child-info">
                <p class="sr__child-name">{{ childName ?? 'Nama Anak' }}</p>
                <p class="sr__child-age">Usia : 5 tahun</p>
              </div>
            </div>

            <div class="sr__level-badge">Level Disleksia : {{ result.dyslexiaLevel ?? '-' }}</div>
          </div>

          <!-- Donut card -->
          <div class="sr__donut-card">
            <h2 class="sr__donut-title">Hasil Screening</h2>
            <div class="sr__donut-body">
              <svg :width="DONUT_CX * 2" :height="DONUT_CY * 2" class="sr__donut-svg">
                <circle
                  :cx="DONUT_CX"
                  :cy="DONUT_CY"
                  :r="DONUT_R"
                  fill="none"
                  stroke="#ede8f8"
                  stroke-width="18"
                />
                <circle
                  v-for="(seg, i) in segments"
                  :key="i"
                  :cx="DONUT_CX"
                  :cy="DONUT_CY"
                  :r="DONUT_R"
                  fill="none"
                  :stroke="seg.color"
                  stroke-width="18"
                  :stroke-dasharray="seg.dash"
                  :stroke-dashoffset="seg.offset"
                  stroke-linecap="butt"
                  style="transform-origin: center; transform: rotate(-90deg)"
                />
                <text
                  :x="DONUT_CX"
                  :y="DONUT_CY + 6"
                  text-anchor="middle"
                  font-size="22"
                  font-weight="700"
                  fill="var(--color-text-dark)"
                >
                  {{ totalScore }}
                </text>
              </svg>

              <div class="sr__legend">
                <div v-for="(seg, i) in segments" :key="i" class="sr__legend-item">
                  <span class="sr__legend-dot" :style="{ background: seg.color }" />
                  <span class="sr__legend-label">{{ seg.label.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: pretest scores -->
        <div class="sr__right">
          <div class="sr__pretest-card">
            <h2 class="sr__pretest-title">Hasil Pretest</h2>
            <div class="sr__pretest-rows">
              <div v-for="(cat, i) in result.categoryScores" :key="i" class="sr__pretest-row">
                <div class="sr__pretest-meta">
                  <span class="sr__pretest-label">{{ cat.label }}</span>
                  <span class="sr__pretest-score">{{ cat.score }}/{{ cat.max }}</span>
                </div>
                <div class="sr__bar-track">
                  <div
                    class="sr__bar-fill"
                    :style="{
                      width: `${(cat.score / cat.max) * 100}%`,
                      background: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                    }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommendation -->
      <div class="sr__recommendation">
        <span class="sr__rec-label">Saran :</span>
        {{ result.recommendation ?? '-' }}
      </div>
    </template>

    <p v-else class="sr__empty">Data hasil screening tidak ditemukan.</p>

    <!-- Actions -->
    <div class="sr__actions">
      <BaseButton variant="outline" color="ternary" @click="emit('back')"> Kembali </BaseButton>
      <BaseButton v-if="result" color="ternary" @click="emit('save', result)"> Simpan </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.sr {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.sr__page-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-dark);
  margin: 0;
}

/* Loading */
.sr__loading {
  display: flex;
  justify-content: center;
  padding: 4rem;
}
.sr__spinner {
  width: 28px;
  height: 28px;
  border: 2px solid #ede8fa;
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Top row */
.sr__top {
  display: flex;
  gap: 1.25rem;
}

/* Left column */
.sr__left {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 0 0 340px;
}

/* Child card */
.sr__child-card {
  background: var(--color-surface-primary);
  border-radius: var(--radius-lg);
  padding: 1.25rem 1.5rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.sr__avatar {
  display: flex;

  align-items: center; /* Vertically centers the text with the avatar */
  gap: 12px;
}
.sr__child-info {
  display: flex;
  flex-direction: column;

  gap: 2px;
}
.sr__child-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-dark);
  margin: 0;
}
.sr__child-age {
  font-size: 13px;
  color: var(--color-text-light);
  margin: 0;
}
.sr__level-badge {
  margin-top: 0.5rem;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-dark);
}

/* Donut card */
.sr__donut-card {
  background: #fdf0f4;
  border-radius: var(--radius-lg);
  padding: 1.25rem 1.5rem;
}
.sr__donut-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-dark);
  margin: 0 0 1rem;
  text-align: center;
}
.sr__donut-body {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.sr__donut-svg {
  flex-shrink: 0;
  overflow: visible;
}
.sr__legend {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.sr__legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
.sr__legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.sr__legend-label {
  font-size: 13px;
  color: var(--color-text-dark);
}

/* Right column */
.sr__right {
  flex: 1;
}
.sr__pretest-card {
  background: var(--color-surface-blue);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  height: 100%;
}
.sr__pretest-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-dark);
  margin: 0 0 1.25rem;
}
.sr__pretest-rows {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.sr__pretest-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.sr__pretest-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sr__pretest-label {
  font-size: 14px;
  color: var(--color-text-dark);
}
.sr__pretest-score {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-dark);
}
.sr__bar-track {
  height: 8px;
  background: #f0ebf8;
  border-radius: 999px;
  overflow: hidden;
}
.sr__bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.4s ease;
}

/* Recommendation */
.sr__recommendation {
  background: var(--color-surface-green);
  border-radius: var(--radius-lg);
  padding: 1rem 1.5rem;
  font-size: 14px;
  color: var(--color-text-dark);
}
.sr__rec-label {
  font-weight: 700;
  margin-right: 4px;
}

/* Empty */
.sr__empty {
  font-size: 14px;
  color: var(--color-text-light);
  text-align: center;
  padding: 2rem;
}

/* Actions */
.sr__actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding-bottom: 1rem;
}

@media (max-width: 640px) {
  .sr__top {
    flex-direction: column;
  }
  .sr__left {
    flex: unset;
    width: 100%;
  }
}
</style>

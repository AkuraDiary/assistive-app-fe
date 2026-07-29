<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { computed } from 'vue'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps<{
  chartData: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      borderColor: string
      tension?: number
    }[]
  }
}>()

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        usePointStyle: true,
        boxWidth: 8,
        boxHeight: 8,
        font: {
          family: "'Inter', sans-serif",
          weight: 'bold' as const,
          size: 13
        },
        color: '#2d2d2d'
      }
    },
    tooltip: {
      backgroundColor: '#fff',
      titleColor: '#2d2d2d',
      bodyColor: '#4b5563',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      padding: 12,
      displayColors: false,
      callbacks: {
        label: function(context: any) {
          return `${context.parsed.y} Modul`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: false
      },
      border: {
        display: false
      },
      ticks: {
        font: {
          family: "'Inter', sans-serif"
        },
        color: '#6b7280'
      }
    },
    x: {
      grid: {
        color: '#f3f4f6',
        drawBorder: false,
        tickBorderDash: [5, 5],
      },
      border: {
        display: false
      },
      ticks: {
        font: {
          family: "'Inter', sans-serif"
        },
        color: '#6b7280'
      }
    }
  },
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  elements: {
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 6,
      hoverBorderWidth: 3
    },
    line: {
      borderWidth: 2.5
    }
  }
}

const vueChartData = computed(() => {
  return {
    labels: props.chartData.labels,
    datasets: props.chartData.datasets.map(ds => ({
      ...ds,
      backgroundColor: ds.borderColor, // for the legend dots
      pointBackgroundColor: '#fff',
      pointBorderColor: ds.borderColor,
    }))
  }
})
</script>

<template>
  <div class="admin-chart-container">
    <Line :data="vueChartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.admin-chart-container {
  height: 400px;
  width: 100%;
}
</style>

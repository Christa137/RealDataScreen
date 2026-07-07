<template>
  <div ref="chartRef" class="chart" data-testid="chart-pie"></div>
</template>

<script setup lang="ts">
import type { EChartsOption } from 'echarts'
import { computed } from 'vue'

import { screenTheme } from '@/config/theme'
import type { CategoryShare } from '@/types/dashboard'

import { useChart } from './useChart'

const props = defineProps<{
  data: CategoryShare[]
}>()

const option = computed<EChartsOption>(() => ({
  color: screenTheme.chartPalette,
  tooltip: { trigger: 'item' },
  legend: {
    bottom: 0,
    textStyle: { color: screenTheme.colors.muted },
  },
  series: [
    {
      type: 'pie',
      radius: ['45%', '68%'],
      center: ['50%', '43%'],
      label: {
        color: screenTheme.colors.text,
        formatter: '{b} {d}%',
      },
      data: props.data,
    },
  ],
}))

const { chartRef } = useChart(option)
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>

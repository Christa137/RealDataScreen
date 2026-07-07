<template>
  <div ref="chartRef" class="chart" data-testid="chart-bar"></div>
</template>

<script setup lang="ts">
import type { EChartsOption } from 'echarts'
import { computed } from 'vue'

import { screenTheme } from '@/config/theme'
import type { RankingItem } from '@/types/dashboard'

import { useChart } from './useChart'

const props = defineProps<{
  data: RankingItem[]
}>()

const option = computed<EChartsOption>(() => ({
  color: [screenTheme.colors.amber],
  tooltip: { trigger: 'axis' },
  grid: { top: 10, right: 18, bottom: 24, left: 44 },
  xAxis: {
    type: 'category',
    data: props.data.map((item) => item.city),
    axisLabel: { color: screenTheme.colors.muted },
    axisLine: { lineStyle: { color: 'rgba(142,183,201,0.35)' } },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: 'rgba(142,183,201,0.12)' } },
    axisLabel: { color: screenTheme.colors.muted },
  },
  series: [
    {
      type: 'bar',
      barWidth: 14,
      data: props.data.map((item) => item.value),
      itemStyle: {
        borderRadius: [6, 6, 0, 0],
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: screenTheme.colors.amber },
            { offset: 1, color: 'rgba(251,191,36,0.18)' },
          ],
        },
      },
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

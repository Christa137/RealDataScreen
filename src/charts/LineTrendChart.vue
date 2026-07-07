<template>
  <div ref="chartRef" class="chart" data-testid="chart-line"></div>
</template>

<script setup lang="ts">
import type { EChartsOption } from 'echarts'
import { computed } from 'vue'

import { screenTheme } from '@/config/theme'
import type { TrendPoint } from '@/types/dashboard'

import { useChart } from './useChart'

const props = defineProps<{
  data: TrendPoint[]
}>()

const option = computed<EChartsOption>(() => ({
  color: [screenTheme.colors.cyan, screenTheme.colors.green],
  tooltip: { trigger: 'axis' },
  grid: { top: 28, right: 16, bottom: 24, left: 42 },
  legend: {
    top: 0,
    right: 0,
    textStyle: { color: screenTheme.colors.muted },
  },
  xAxis: {
    type: 'category',
    data: props.data.map((item) => item.time),
    axisLine: { lineStyle: { color: 'rgba(142,183,201,0.35)' } },
    axisLabel: { color: screenTheme.colors.muted },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: 'rgba(142,183,201,0.12)' } },
    axisLabel: { color: screenTheme.colors.muted },
  },
  series: [
    {
      name: '访问量',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      areaStyle: { opacity: 0.16 },
      data: props.data.map((item) => item.visits),
    },
    {
      name: '订单数',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      data: props.data.map((item) => item.orders),
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

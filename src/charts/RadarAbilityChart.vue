<template>
  <div ref="chartRef" class="chart" data-testid="chart-radar"></div>
</template>

<script setup lang="ts">
import type { EChartsOption } from 'echarts'
import { computed } from 'vue'

import { screenTheme } from '@/config/theme'
import type { RadarItem } from '@/types/dashboard'

import { useChart } from './useChart'

const props = defineProps<{
  data: RadarItem[]
}>()

const option = computed<EChartsOption>(() => ({
  color: [screenTheme.colors.green],
  tooltip: {},
  radar: {
    radius: '63%',
    indicator: props.data.map((item) => ({
      name: item.name,
      max: item.max,
    })),
    axisName: { color: screenTheme.colors.muted },
    splitLine: { lineStyle: { color: 'rgba(142,183,201,0.18)' } },
    splitArea: { areaStyle: { color: ['rgba(36,217,255,0.04)', 'rgba(36,217,255,0.01)'] } },
    axisLine: { lineStyle: { color: 'rgba(142,183,201,0.2)' } },
  },
  series: [
    {
      type: 'radar',
      areaStyle: { opacity: 0.22 },
      data: [
        {
          value: props.data.map((item) => item.value),
          name: '综合能力',
        },
      ],
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

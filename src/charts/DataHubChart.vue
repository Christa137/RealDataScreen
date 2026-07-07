<template>
  <div ref="chartRef" class="chart" data-testid="chart-hub"></div>
</template>

<script setup lang="ts">
import type { EChartsOption } from 'echarts'
import { computed } from 'vue'

import { screenTheme } from '@/config/theme'
import type { HubLink, NodeStatus } from '@/types/dashboard'

import { useChart } from './useChart'

const props = defineProps<{
  nodes: NodeStatus[]
  links: HubLink[]
}>()

const option = computed<EChartsOption>(() => ({
  color: screenTheme.chartPalette,
  tooltip: {},
  series: [
    {
      type: 'graph',
      layout: 'circular',
      roam: false,
      edgeSymbol: ['none', 'arrow'],
      edgeSymbolSize: [0, 10],
      label: {
        show: true,
        color: screenTheme.colors.text,
        fontWeight: 700,
      },
      lineStyle: {
        color: screenTheme.colors.cyan,
        opacity: 0.48,
        width: 2,
        curveness: 0.22,
      },
      emphasis: {
        focus: 'adjacency',
      },
      data: props.nodes.map((node) => ({
        name: node.name,
        load: node.load,
        value: node.load,
        symbolSize: 46 + node.load / 3,
        itemStyle: {
          color:
            node.status === 'online'
              ? screenTheme.colors.green
              : node.status === 'busy'
                ? screenTheme.colors.amber
                : screenTheme.colors.rose,
          shadowBlur: 22,
          shadowColor: screenTheme.colors.cyan,
        },
      })),
      links: props.links,
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

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

const CENTER: [number, number] = [50, 50]
const RADIUS = 34

// Place nodes evenly on a ring around the center, top first, clockwise
function getCoord(index: number, total: number): [number, number] {
  const angle = -Math.PI / 2 + (index / total) * Math.PI * 2
  return [
    Math.round((CENTER[0] + RADIUS * Math.cos(angle)) * 100) / 100,
    Math.round((CENTER[1] + RADIUS * Math.sin(angle)) * 100) / 100,
  ]
}

const statusColor = (s: NodeStatus['status']) =>
  s === 'online'
    ? screenTheme.colors.green
    : s === 'busy'
      ? screenTheme.colors.amber
      : screenTheme.colors.rose

const statusLabel: Record<string, string> = {
  online: '在线',
  busy: '繁忙',
  offline: '离线',
}

const option = computed<EChartsOption>(() => {
  const nodes = props.nodes
  const links = props.links

  // ── Hub-spoke radial lines (center → each node) ──────────────
  const spokeLines = nodes.map((_, i) => ({
    coords: [CENTER, getCoord(i, nodes.length)],
  }))

  // ── Peer-to-peer data links with flowing dots ─────────────────
  const indexMap = new Map(nodes.map((n, i) => [n.name, i]))
  const dataLinks = links
    .map((l) => {
      const s = indexMap.get(l.source)
      const t = indexMap.get(l.target)
      if (s === undefined || t === undefined) return null
      return {
        coords: [getCoord(s, nodes.length), getCoord(t, nodes.length)],
      }
    })
    .filter((item): item is { coords: [[number, number], [number, number]] } => item !== null)

  return {
    tooltip: {
      backgroundColor: 'rgba(7, 17, 31, 0.94)',
      borderColor: screenTheme.colors.cyan,
      textStyle: { color: screenTheme.colors.text, fontSize: 13 },
      formatter: (params: { seriesName?: string; name?: string; data?: { name?: string; load?: number; status?: string } }) => {
        const d = params.data
        if (!d || !d.name) return ''
        return `<strong>${d.name}</strong><br/>负载: ${d.load ?? '-'}%<br/>状态: ${statusLabel[d.status ?? ''] ?? '-'}`
      },
    },
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    xAxis: { show: false, min: 0, max: 100 },
    yAxis: { show: false, min: 0, max: 100 },
    series: [
      // ── ① Background: fading concentric halo rings ──────────────
      {
        type: 'scatter',
        silent: true,
        symbol: 'circle',
        symbolSize: 200,
        data: [CENTER],
        itemStyle: {
          color: 'transparent',
          borderColor: 'rgba(56,189,248,0.06)',
          borderWidth: 2,
        },
      },
      {
        type: 'scatter',
        silent: true,
        symbol: 'circle',
        symbolSize: 150,
        data: [CENTER],
        itemStyle: {
          color: 'transparent',
          borderColor: 'rgba(56,189,248,0.10)',
          borderWidth: 1.5,
        },
      },
      {
        type: 'scatter',
        silent: true,
        symbol: 'circle',
        symbolSize: 100,
        data: [CENTER],
        itemStyle: {
          color: 'transparent',
          borderColor: 'rgba(56,189,248,0.15)',
          borderWidth: 1,
        },
      },

      // ── ② Hub-spoke flowing radial lines ───────────────────────
      {
        type: 'lines',
        coordinateSystem: 'cartesian2d',
        polyline: false,
        silent: true,
        effect: {
          show: true,
          period: 3,
          trailLength: 0.25,
          symbol: 'circle',
          symbolSize: 4,
          color: 'rgba(56,189,248,0.7)',
          loop: true,
        },
        lineStyle: {
          color: 'rgba(56,189,248,0.18)',
          width: 1.2,
          opacity: 0.6,
          curveness: 0,
        },
        data: spokeLines,
      },

      // ── ③ Peer-to-peer data links with flowing dots ────────────
      {
        type: 'lines',
        coordinateSystem: 'cartesian2d',
        polyline: false,
        silent: true,
        effect: {
          show: true,
          period: 5,
          trailLength: 0.15,
          symbol: 'diamond',
          symbolSize: 3,
          color: 'rgba(45,212,191,0.5)',
          loop: true,
        },
        lineStyle: {
          color: 'rgba(45,212,191,0.2)',
          width: 1.5,
          opacity: 0.4,
          curveness: 0.12,
        },
        data: dataLinks,
      },

      // ── ④ Center hub node with strong glow ─────────────────────
      {
        type: 'scatter',
        silent: false,
        symbol: 'circle',
        symbolSize: 60,
        data: [
          {
            value: CENTER,
            name: '监控中枢',
            itemStyle: {
              color: screenTheme.colors.cyan,
              shadowBlur: 40,
              shadowColor: screenTheme.colors.cyan,
              borderColor: 'rgba(56,189,248,0.3)',
              borderWidth: 3,
              borderType: 'solid',
            },
          },
        ],
        label: {
          show: true,
          position: 'top',
          distance: 8,
          color: screenTheme.colors.text,
          fontSize: 13,
          fontWeight: 700,
          formatter: '监控中枢',
          textShadowColor: 'rgba(0,0,0,0.7)',
          textShadowBlur: 4,
        },
      },

      // ── ⑤ Inner pulse ring (animation via effectScatter) ───────
      {
        type: 'effectScatter',
        silent: true,
        symbol: 'circle',
        symbolSize: 45,
        data: [CENTER],
        rippleEffect: {
          period: 3,
          scale: 3.5,
          brushType: 'stroke',
          color: screenTheme.colors.cyan,
        },
        itemStyle: {
          color: 'transparent',
          borderColor: 'transparent',
        },
      },

      // ── ⑥ Peripheral business nodes (effectScatter) ────────────
      {
        type: 'effectScatter',
        symbol: 'circle',
        rippleEffect: {
          period: 4,
          scale: 2.2,
          brushType: 'stroke',
        },
        label: {
          show: true,
          position: 'right',
          distance: 6,
          color: screenTheme.colors.text,
          fontSize: 12,
          fontWeight: 600,
          textShadowColor: 'rgba(0,0,0,0.5)',
          textShadowBlur: 3,
          formatter: (p: { data?: { name?: string } }) => (p.data as { name?: string })?.name ?? '',
        },
        data: nodes.map((n, i) => {
          const coord = getCoord(i, nodes.length)
          return {
            value: coord,
            name: n.name,
            load: n.load,
            status: n.status,
            symbolSize: 28 + n.load / 4,
            itemStyle: {
              color: statusColor(n.status),
              shadowBlur: 16,
              shadowColor: statusColor(n.status),
              borderColor: 'rgba(255,255,255,0.2)',
              borderWidth: 1.5,
            },
            rippleEffect: {
              color: statusColor(n.status),
            },
          }
        }),
      },
    ],
  }
})

const { chartRef } = useChart(option)
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>

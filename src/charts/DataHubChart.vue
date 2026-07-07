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

// Fixed visual coordinates for business nodes (cartesian 0-100 space, center at 50,50)
const COORD_MAP: Record<string, [number, number]> = {
  采集网关: [50, 15],
  实时计算: [86, 35],
  指标仓库: [73, 80],
  告警中心: [27, 80],
  'API 边缘': [14, 35],
}

const CENTER: [number, number] = [50, 50]

function getCoord(name: string): [number, number] {
  return COORD_MAP[name] ?? CENTER
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
  const spokeLines = nodes.map((n) => ({
    coords: [CENTER, getCoord(n.name)],
  }))

  // ── Peer-to-peer data links with flowing dots ─────────────────
  const dataLinks = links.map((l) => ({
    coords: [getCoord(l.source), getCoord(l.target)],
  }))

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
            name: '数据中枢',
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
          formatter: '数据中枢',
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
        data: nodes.map((n) => {
          const coord = getCoord(n.name)
          return {
            value: coord,
            name: n.name,
            load: n.load,
            status: n.status,
            symbolSize: 32 + n.load / 3,
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

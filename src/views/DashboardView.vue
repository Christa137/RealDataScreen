<template>
  <BigScreenLayout>
    <div class="dashboard-shell">
      <ScreenHeader />

      <div v-if="dashboard" class="dashboard-grid">
        <section class="dashboard-grid__metrics">
          <MetricCard v-for="metric in dashboard.metrics" :key="metric.id" :metric="metric" />
        </section>

        <BasePanel class="panel-trend" title="访问趋势" meta="Visits / Orders">
          <LineTrendChart :data="dashboard.trends" />
        </BasePanel>

        <BasePanel class="panel-category" title="业务占比" meta="Share">
          <PieStatusChart :data="dashboard.categories" />
        </BasePanel>

        <BasePanel class="panel-hub" title="数据中枢态势" meta="Realtime Topology">
          <DataHubChart :nodes="dashboard.nodes" :links="dashboard.links" />
          <div class="hub-kpis">
            <span>吞吐 {{ hubKpis.throughput }}</span>
            <span>延迟 {{ hubKpis.latency }}</span>
            <span>可用性 {{ hubKpis.uptime }}</span>
          </div>
        </BasePanel>

        <BasePanel class="panel-ranking" title="区域访问排名" meta="Top Cities">
          <BarRankingChart :data="dashboard.rankings" />
        </BasePanel>

        <BasePanel class="panel-radar" title="平台能力雷达" meta="Capability">
          <RadarAbilityChart :data="dashboard.radar" />
        </BasePanel>

        <BasePanel class="panel-activity" title="实时动态" meta="Live Feed">
          <ActivityList :activities="dashboard.activities" />
        </BasePanel>

        <BasePanel class="panel-nodes" title="服务节点状态" meta="Load">
          <NodeStatusGrid :nodes="dashboard.nodes" />
        </BasePanel>
      </div>

      <div v-else class="dashboard-loading">
        {{ store.error || '数据加载中...' }}
      </div>
    </div>
  </BigScreenLayout>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'

import BarRankingChart from '@/charts/BarRankingChart.vue'
import DataHubChart from '@/charts/DataHubChart.vue'
import LineTrendChart from '@/charts/LineTrendChart.vue'
import PieStatusChart from '@/charts/PieStatusChart.vue'
import RadarAbilityChart from '@/charts/RadarAbilityChart.vue'
import BasePanel from '@/components/base/BasePanel.vue'
import ActivityList from '@/components/dashboard/ActivityList.vue'
import MetricCard from '@/components/dashboard/MetricCard.vue'
import NodeStatusGrid from '@/components/dashboard/NodeStatusGrid.vue'
import ScreenHeader from '@/components/dashboard/ScreenHeader.vue'
import BigScreenLayout from '@/layouts/BigScreenLayout.vue'
import { useDashboardStore } from '@/stores/dashboardStore'

const store = useDashboardStore()
const dashboard = computed(() => store.data)

const hubKpis = computed(() => {
  const nodes = dashboard.value?.nodes ?? []
  if (nodes.length === 0) return { throughput: '-- k/s', latency: '--ms', uptime: '--%' }
  const avgLoad = nodes.reduce((s, n) => s + n.load, 0) / nodes.length
  const onlineCount = nodes.filter((n) => n.status !== 'offline').length
  const uptime = Math.round((onlineCount / nodes.length) * 10000) / 100
  const throughput = Math.round(avgLoad * 950 + 4000)
  const latency = Math.round(32 - avgLoad * 0.18)
  return {
    throughput: `${(throughput / 1000).toFixed(1)}k/s`,
    latency: `${latency}ms`,
    uptime: `${uptime.toFixed(2)}%`,
  }
})

onMounted(async () => {
  await store.load()
  store.startRealtime()
})

onBeforeUnmount(() => {
  store.stopRealtime()
})
</script>

<style scoped>
.dashboard-shell {
  position: relative;
  min-height: 100vh;
  padding: 0 22px 22px;
  color: var(--text);
}

.dashboard-shell::before {
  position: fixed;
  inset: 0;
  pointer-events: none;
  content: '';
  background-image:
    linear-gradient(rgba(56, 189, 248, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(56, 189, 248, 0.045) 1px, transparent 1px);
  background-size: 38px 38px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.9), transparent);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 430px minmax(0, 1fr) 430px;
  grid-template-rows: 116px 278px 278px 180px;
  gap: 14px;
  min-height: calc(100vh - 100px);
}

.dashboard-grid__metrics {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.panel-trend {
  grid-column: 1;
  grid-row: 2;
}

.panel-category {
  grid-column: 1;
  grid-row: 3;
}

.panel-hub {
  grid-column: 2;
  grid-row: 2 / 4;
}

.panel-ranking {
  grid-column: 3;
  grid-row: 2;
}

.panel-radar {
  grid-column: 3;
  grid-row: 3;
}

.panel-activity {
  grid-column: 1 / 2;
  grid-row: 4;
}

.panel-nodes {
  grid-column: 2 / -1;
  grid-row: 4;
}

.hub-kpis {
  position: absolute;
  right: 22px;
  bottom: 20px;
  left: 22px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.hub-kpis span {
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid rgba(56, 189, 248, 0.18);
  border-radius: 6px;
  background: rgba(3, 11, 23, 0.56);
  color: var(--text);
  font-size: 14px;
  text-align: center;
}

.dashboard-loading {
  display: grid;
  min-height: calc(100vh - 100px);
  place-items: center;
  color: var(--muted);
  font-size: 18px;
}

@media (max-width: 1180px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }

  .dashboard-grid__metrics,
  .panel-trend,
  .panel-category,
  .panel-hub,
  .panel-ranking,
  .panel-radar,
  .panel-activity,
  .panel-nodes {
    grid-column: 1;
    grid-row: auto;
    min-height: 280px;
  }

  .dashboard-grid__metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    min-height: 0;
  }
}
</style>

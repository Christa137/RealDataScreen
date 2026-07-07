<template>
  <article class="metric-card" :class="`metric-card--${metric.tone}`" data-testid="metric-card">
    <span class="metric-card__label">{{ metric.label }}</span>
    <strong>{{ formatNumber(metric.value) }}<em>{{ metric.unit }}</em></strong>
    <span class="metric-card__trend">较昨日 +{{ metric.trend.toFixed(1) }}%</span>
  </article>
</template>

<script setup lang="ts">
import type { SummaryMetric } from '@/types/dashboard'
import { formatNumber } from '@/utils/format'

defineProps<{
  metric: SummaryMetric
}>()
</script>

<style scoped>
.metric-card {
  position: relative;
  min-width: 0;
  min-height: 98px;
  padding: 14px;
  overflow: hidden;
  border: 1px solid rgba(111, 221, 255, 0.18);
  border-radius: 8px;
  background: rgba(10, 31, 54, 0.72);
}

.metric-card::after {
  position: absolute;
  right: -24px;
  bottom: -24px;
  width: 82px;
  height: 82px;
  content: '';
  border: 1px solid currentcolor;
  border-radius: 50%;
  opacity: 0.16;
}

.metric-card__label,
.metric-card__trend {
  display: block;
  color: var(--muted);
  font-size: 13px;
}

.metric-card strong {
  display: block;
  margin: 9px 0 7px;
  color: currentcolor;
  font-size: 27px;
  line-height: 1;
}

.metric-card em {
  margin-left: 4px;
  color: var(--muted);
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
}

.metric-card--cyan {
  color: var(--cyan);
}

.metric-card--green {
  color: var(--green);
}

.metric-card--amber {
  color: var(--amber);
}

.metric-card--rose {
  color: var(--rose);
}
</style>

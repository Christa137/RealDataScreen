<template>
  <article class="metric-card" :class="`metric-card--${metric.tone}`" data-testid="metric-card">
    <span class="metric-card__label">{{ metric.label }}</span>
    <strong>{{ formatNumber(metric.value) }}<em>{{ metric.unit }}</em></strong>
    <span class="metric-card__trend">
      较昨日
      <span :class="metric.trend >= 0 ? 'up' : 'down'">
        {{ metric.trend >= 0 ? '+' : '' }}{{ metric.trend.toFixed(1) }}%
      </span>
    </span>
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
  border: 1px solid rgba(56, 189, 248, 0.18);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(56, 189, 248, 0.04), transparent 50%),
    rgba(10, 31, 54, 0.76);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18);
  transition: box-shadow 0.3s ease;
}

.metric-card:hover {
  box-shadow:
    0 4px 28px rgba(0, 0, 0, 0.22),
    inset 0 0 20px rgba(56, 189, 248, 0.04);
}

.metric-card::before {
  position: absolute;
  top: 0;
  right: 0;
  width: 1px;
  height: 60%;
  content: '';
  background: linear-gradient(180deg, currentcolor, transparent);
  opacity: 0.24;
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
  opacity: 0.12;
}

.metric-card__label,
.metric-card__trend {
  display: block;
  color: var(--muted);
  font-size: 13px;
}

.metric-card__trend .up {
  color: var(--green);
}

.metric-card__trend .down {
  color: var(--rose);
}

.metric-card strong {
  display: block;
  margin: 10px 0 8px;
  color: currentcolor;
  font-size: 28px;
  font-weight: 800;
  line-height: 1;
  text-shadow: 0 0 16px currentcolor, 0 0 4px currentcolor;
}

.metric-card em {
  margin-left: 4px;
  color: var(--muted);
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  text-shadow: none;
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

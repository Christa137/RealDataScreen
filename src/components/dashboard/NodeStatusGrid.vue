<template>
  <div class="node-grid">
    <article
      v-for="node in nodes"
      :key="node.name"
      class="node-card"
      :class="`node-card--${node.status}`"
    >
      <div class="node-card__head">
        <strong class="node-card__name" :title="node.name">{{ node.name }}</strong>
        <span class="node-card__badge">{{ statusText(node.status) }}</span>
      </div>

      <div class="node-card__load">
        <div class="node-card__track">
          <div
            class="node-card__bar"
            :style="{ width: `${Math.min(100, Math.max(0, node.load))}%` }"
          />
        </div>
        <span class="node-card__value">{{ node.load }}%</span>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import type { NodeStatus } from '@/types/dashboard'

defineProps<{
  nodes: NodeStatus[]
}>()

function statusText(status: NodeStatus['status']) {
  return { online: '在线', busy: '繁忙', offline: '离线' }[status]
}
</script>

<style scoped>
.node-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  height: 100%;
  overflow: hidden;
}

.node-card {
  position: relative;
  display: grid;
  gap: 8px;
  align-content: center;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid rgba(56, 189, 248, 0.16);
  border-radius: 8px;
  background: linear-gradient(180deg, rgba(56, 189, 248, 0.08), rgba(56, 189, 248, 0.02));
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.node-card::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  border-radius: 8px 0 0 8px;
  content: '';
}

.node-card--online {
  border-color: rgba(52, 211, 153, 0.25);
  background: linear-gradient(180deg, rgba(52, 211, 153, 0.08), rgba(52, 211, 153, 0.02));
}

.node-card--online::before {
  background: var(--green);
  box-shadow: 0 0 10px var(--green);
}

.node-card--busy {
  border-color: rgba(251, 191, 36, 0.28);
  background: linear-gradient(180deg, rgba(251, 191, 36, 0.1), rgba(251, 191, 36, 0.02));
}

.node-card--busy::before {
  background: var(--amber);
  box-shadow: 0 0 10px var(--amber);
}

.node-card--offline {
  border-color: rgba(251, 113, 133, 0.28);
  background: linear-gradient(180deg, rgba(251, 113, 133, 0.1), rgba(251, 113, 133, 0.02));
}

.node-card--offline::before {
  background: var(--rose);
  box-shadow: 0 0 10px var(--rose);
}

.node-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.node-card__name {
  color: var(--text);
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.node-card__badge {
  flex-shrink: 0;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.node-card--online .node-card__badge {
  background: rgba(52, 211, 153, 0.15);
  color: var(--green);
}

.node-card--busy .node-card__badge {
  background: rgba(251, 191, 36, 0.15);
  color: var(--amber);
}

.node-card--offline .node-card__badge {
  background: rgba(251, 113, 133, 0.15);
  color: var(--rose);
}

.node-card__load {
  display: flex;
  align-items: center;
  gap: 8px;
}

.node-card__track {
  position: relative;
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.node-card__bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.node-card--online .node-card__bar {
  background: linear-gradient(90deg, #34d399, #2dd4bf);
  box-shadow: 0 0 8px rgba(52, 211, 153, 0.45);
}

.node-card--busy .node-card__bar {
  background: linear-gradient(90deg, #fbbf24, #f59e0b);
  box-shadow: 0 0 8px rgba(251, 191, 36, 0.5);
}

.node-card--offline .node-card__bar {
  background: linear-gradient(90deg, #fb7185, #f43f5e);
  box-shadow: 0 0 8px rgba(251, 113, 133, 0.5);
}

.node-card__value {
  flex-shrink: 0;
  min-width: 34px;
  color: var(--text);
  font-size: 12px;
  font-weight: 700;
  text-align: right;
}

@media (max-width: 1180px) {
  .node-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>

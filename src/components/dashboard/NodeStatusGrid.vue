<template>
  <div class="node-grid">
    <article v-for="node in nodes" :key="node.name" :class="`node-grid__item--${node.status}`">
      <div>
        <strong>{{ node.name }}</strong>
        <span>{{ node.status }}</span>
      </div>
      <meter min="0" max="100" :value="node.load"></meter>
    </article>
  </div>
</template>

<script setup lang="ts">
import type { NodeStatus } from '@/types/dashboard'

defineProps<{
  nodes: NodeStatus[]
}>()
</script>

<style scoped>
.node-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  height: 100%;
}

.node-grid article {
  display: grid;
  gap: 10px;
  align-content: center;
  min-width: 0;
  padding: 12px;
  border: 1px solid rgba(56, 189, 248, 0.16);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
}

.node-grid div {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.node-grid strong {
  color: var(--text);
  font-size: 14px;
}

.node-grid span {
  color: var(--muted);
  font-size: 12px;
}

.node-grid meter {
  width: 100%;
  height: 8px;
}

.node-grid__item--online {
  color: var(--green);
}

.node-grid__item--busy {
  color: var(--amber);
}

.node-grid__item--offline {
  color: var(--rose);
}
</style>

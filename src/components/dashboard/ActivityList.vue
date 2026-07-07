<template>
  <ul class="activity-list">
    <li v-for="item in activities" :key="item.id" :class="`activity-list__item--${item.level}`">
      <time>{{ item.time }}</time>
      <span>{{ item.title }}</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { ActivityItem } from '@/types/dashboard'

defineProps<{
  activities: ActivityItem[]
}>()
</script>

<style scoped>
.activity-list {
  display: grid;
  gap: 9px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.activity-list li {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 10px;
  align-items: center;
  min-height: 34px;
  padding: 0 10px;
  border: 1px solid rgba(56, 189, 248, 0.14);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text);
  font-size: 13px;
}

.activity-list time {
  color: var(--muted);
  font-size: 12px;
}

.activity-list__item--success {
  border-left: 3px solid var(--green);
}

.activity-list__item--warning {
  border-left: 3px solid var(--amber);
}

.activity-list__item--info {
  border-left: 3px solid var(--cyan);
}
</style>

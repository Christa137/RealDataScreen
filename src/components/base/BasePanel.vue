<template>
  <section class="base-panel">
    <div class="base-panel__header">
      <h2>{{ title }}</h2>
      <span v-if="meta">{{ meta }}</span>
    </div>
    <div class="base-panel__body">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  meta?: string
}>()
</script>

<style scoped>
.base-panel {
  position: relative;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  border: 1px solid var(--panel-border);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(36, 217, 255, 0.09), transparent 34%),
    linear-gradient(180deg, rgba(13, 36, 63, 0.92), rgba(5, 17, 32, 0.78));
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.22), inset 0 0 22px rgba(36, 217, 255, 0.06);
}

.base-panel::before {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: '';
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.07), transparent);
  transform: translateX(-100%);
  animation: panel-scan 6s linear infinite;
}

.base-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 38px;
  padding: 0 14px;
  border-bottom: 1px solid rgba(111, 221, 255, 0.16);
}

.base-panel__header h2 {
  margin: 0;
  color: var(--text);
  font-size: 15px;
  font-weight: 700;
}

.base-panel__header span {
  color: var(--muted);
  font-size: 12px;
}

.base-panel__body {
  position: relative;
  height: calc(100% - 38px);
  min-height: 0;
  padding: 12px;
}

@keyframes panel-scan {
  0% {
    transform: translateX(-100%);
  }

  60%,
  100% {
    transform: translateX(100%);
  }
}
</style>

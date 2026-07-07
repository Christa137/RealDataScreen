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
    linear-gradient(135deg, rgba(56, 189, 248, 0.06), transparent 38%),
    linear-gradient(180deg, rgba(13, 36, 63, 0.94), rgba(5, 17, 32, 0.82));
  box-shadow:
    0 18px 50px rgba(0, 0, 0, 0.24),
    inset 0 0 24px rgba(56, 189, 248, 0.04),
    0 0 0 1px rgba(56, 189, 248, 0.08);
}

/* top-left corner accent */
.base-panel::before {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: '';
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.06), transparent);
  transform: translateX(-100%);
  animation: panel-scan 7s linear infinite;
}

/* corner decoration lines */
.base-panel::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 18px;
  height: 18px;
  pointer-events: none;
  content: '';
  border-top: 2px solid var(--cyan);
  border-left: 2px solid var(--cyan);
  border-top-left-radius: 6px;
  opacity: 0.5;
}

.base-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 16px;
  border-bottom: 1px solid rgba(56, 189, 248, 0.18);
  background: linear-gradient(
    90deg,
    rgba(56, 189, 248, 0.08),
    transparent 60%
  );
}

.base-panel__header h2 {
  position: relative;
  margin: 0;
  padding-left: 12px;
  color: var(--text);
  font-size: 15px;
  font-weight: 700;
  text-shadow: 0 0 12px rgba(56, 189, 248, 0.3);
}

.base-panel__header h2::before {
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: 0;
  width: 3px;
  content: '';
  border-radius: 2px;
  background: linear-gradient(180deg, var(--cyan), var(--jade));
}

.base-panel__header span {
  color: var(--muted);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.base-panel__body {
  position: relative;
  height: calc(100% - 40px);
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

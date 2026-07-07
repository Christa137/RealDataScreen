<template>
  <section class="base-panel">
    <!-- four corner scroll accents -->
    <span class="panel-corner panel-corner--tl"></span>
    <span class="panel-corner panel-corner--tr"></span>
    <span class="panel-corner panel-corner--bl"></span>
    <span class="panel-corner panel-corner--br"></span>

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
  animation: panel-border-glow 4s ease-in-out infinite;
}

/* ── border glow flicker ───────────────────── */
@keyframes panel-border-glow {
  0%,
  100% {
    border-color: rgba(56, 189, 248, 0.22);
    box-shadow:
      0 18px 50px rgba(0, 0, 0, 0.24),
      inset 0 0 24px rgba(56, 189, 248, 0.04),
      0 0 0 1px rgba(56, 189, 248, 0.06);
  }

  50% {
    border-color: rgba(56, 189, 248, 0.38);
    box-shadow:
      0 18px 50px rgba(0, 0, 0, 0.24),
      inset 0 0 24px rgba(56, 189, 248, 0.06),
      0 0 6px rgba(56, 189, 248, 0.1),
      0 0 0 1px rgba(56, 189, 248, 0.14);
  }
}

/* ── scan line ─────────────────────────────── */
.base-panel::before {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  content: '';
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
  transform: translateX(-100%);
  animation: panel-scan 8s linear infinite;
}

@keyframes panel-scan {
  0% {
    transform: translateX(-100%);
  }

  55%,
  100% {
    transform: translateX(100%);
  }
}

/* ── four corner scroll / lattice accents ──── */
.panel-corner {
  position: absolute;
  z-index: 2;
  width: 24px;
  height: 24px;
  pointer-events: none;
  opacity: 0.55;
}

.panel-corner--tl {
  top: -1px;
  left: -1px;
  border-top: 2px solid var(--cyan);
  border-left: 2px solid var(--cyan);
  border-top-left-radius: 6px;
}

.panel-corner--tr {
  top: -1px;
  right: -1px;
  border-top: 2px solid var(--cyan);
  border-right: 2px solid var(--cyan);
  border-top-right-radius: 6px;
}

.panel-corner--bl {
  bottom: -1px;
  left: -1px;
  border-bottom: 2px solid var(--cyan);
  border-left: 2px solid var(--cyan);
  border-bottom-left-radius: 6px;
}

.panel-corner--br {
  right: -1px;
  bottom: -1px;
  border-bottom: 2px solid var(--cyan);
  border-right: 2px solid var(--cyan);
  border-bottom-right-radius: 6px;
}

/* ── header with HUD look ──────────────────── */
.base-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 18px;
  border-bottom: 1px solid rgba(56, 189, 248, 0.2);
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.1), transparent 70%);
}

/* header bottom glow line */
.base-panel__header::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 1px;
  pointer-events: none;
  content: '';
  background: linear-gradient(90deg, var(--cyan), transparent 60%);
  opacity: 0.5;
}

.base-panel__header h2 {
  position: relative;
  margin: 0;
  padding-left: 14px;
  color: var(--text);
  font-size: 15px;
  font-weight: 700;
  text-shadow: 0 0 14px rgba(56, 189, 248, 0.35);
  letter-spacing: 1px;
}

/* HUD-style title left accent bar */
.base-panel__header h2::before {
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: 0;
  width: 3px;
  content: '';
  border-radius: 2px;
  background: linear-gradient(180deg, var(--cyan), var(--jade));
  box-shadow: 0 0 6px var(--cyan);
}

/* HUD-style title diamond indicator */
.base-panel__header h2::after {
  position: absolute;
  top: 50%;
  right: -12px;
  width: 6px;
  height: 6px;
  content: '';
  background: var(--cyan);
  transform: translateY(-50%) rotate(45deg);
  opacity: 0.6;
}

.base-panel__header span {
  color: var(--muted);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 3px;
  padding: 2px 8px;
}

.base-panel__body {
  position: relative;
  height: calc(100% - 40px);
  min-height: 0;
  padding: 12px;
}
</style>

<template>
  <header class="screen-header">
    <div class="screen-header__side">
      <span class="hud-bracket left"></span>
      <span class="status-dot"></span>
      <span class="hud-label">SYS NORMAL</span>
    </div>

    <div class="screen-header__title">
      <span class="hud-segment left-seg"></span>
      <div class="title-core">
        <strong>DataScreen</strong>
        <span>数据大屏</span>
        <div class="title-underline"></div>
      </div>
      <span class="hud-segment right-seg"></span>
    </div>

    <div class="screen-header__side screen-header__side--right">
      <span class="hud-label">{{ clock }}</span>
      <span class="hud-bracket right"></span>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

import { formatClock } from '@/utils/format'

const clock = ref(formatClock())
let timer: number | undefined

onMounted(() => {
  timer = window.setInterval(() => {
    clock.value = formatClock()
  }, 1000)
})

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
})
</script>

<style scoped>
.screen-header {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  height: 78px;
  padding: 0 28px;
  background:
    linear-gradient(
      90deg,
      transparent 0%,
      rgba(56, 189, 248, 0.06) 35%,
      rgba(56, 189, 248, 0.12) 50%,
      rgba(56, 189, 248, 0.06) 65%,
      transparent 100%
    ),
    linear-gradient(180deg, rgba(13, 37, 66, 0.92), rgba(7, 17, 31, 0.6));
}

/* bottom scan line */
.screen-header::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 1px;
  pointer-events: none;
  content: '';
  background: linear-gradient(
    90deg,
    transparent,
    rgba(56, 189, 248, 0.3) 15%,
    var(--cyan) 50%,
    rgba(56, 189, 248, 0.3) 85%,
    transparent
  );
  opacity: 0.7;
}

/* ── HUD label style ───────────────────────── */
.hud-label {
  font-family: "Courier New", "Consolas", monospace;
  font-size: 12px;
  letter-spacing: 2px;
  color: var(--muted);
  border: 1px solid rgba(56, 189, 248, 0.18);
  border-radius: 2px;
  padding: 3px 10px;
  background: rgba(7, 17, 31, 0.5);
}

/* ── HUD corner brackets ───────────────────── */
.hud-bracket {
  display: inline-block;
  width: 10px;
  height: 20px;
  border-color: var(--cyan);
  border-style: solid;
  opacity: 0.45;
}

.hud-bracket.left {
  border-width: 1px 0 1px 1px;
  margin-right: 10px;
}

.hud-bracket.right {
  border-width: 1px 1px 1px 0;
  margin-left: 10px;
}

/* ── HUD segment marks ─────────────────────── */
.hud-segment {
  display: inline-block;
  width: 16px;
  height: 1px;
  background: var(--cyan);
  opacity: 0.5;
  margin: 0 18px;
}

.hud-segment::after {
  display: block;
  width: 4px;
  height: 4px;
  content: '';
  margin-top: -1.5px;
  background: var(--cyan);
  transform: rotate(45deg);
  opacity: 0.6;
}

/* ── Title area ────────────────────────────── */
.screen-header__title {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-core {
  position: relative;
  display: flex;
  gap: 16px;
  align-items: baseline;
  justify-content: center;
  color: var(--text);
  padding-bottom: 10px;
}

.title-core strong {
  font-size: 34px;
  letter-spacing: 4px;
  text-shadow:
    0 0 32px rgba(56, 189, 248, 0.5),
    0 0 8px rgba(56, 189, 248, 0.25),
    0 2px 0 rgba(0, 0, 0, 0.4);
}

.title-core span {
  color: var(--cyan);
  font-size: 22px;
  font-weight: 700;
  text-shadow: 0 0 16px rgba(56, 189, 248, 0.4);
  letter-spacing: 2px;
}

/* title bottom accent triple line */
.title-underline {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 420px;
  transform: translateX(-50%);
}

.title-underline,
.title-underline::before,
.title-underline::after {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--cyan), var(--jade), var(--cyan), transparent);
}

.title-underline {
  opacity: 0.7;
}

.title-underline::before {
  position: absolute;
  right: 0;
  bottom: 3px;
  left: 0;
  content: '';
  opacity: 0.4;
}

.title-underline::after {
  position: absolute;
  right: 0;
  bottom: 6px;
  left: 0;
  content: '';
  opacity: 0.2;
}

/* ── Side areas ────────────────────────────── */
.screen-header__side {
  display: flex;
  gap: 9px;
  align-items: center;
  color: var(--muted);
  font-size: 14px;
}

.screen-header__side--right {
  justify-content: flex-end;
}

/* ── Status dot with pulse ─────────────────── */
.status-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 14px var(--green);
  animation: status-pulse 2s ease-in-out infinite;
}

@keyframes status-pulse {
  0%,
  100% {
    box-shadow: 0 0 8px var(--green);
  }

  50% {
    box-shadow: 0 0 22px var(--green), 0 0 36px rgba(52, 211, 153, 0.42);
  }
}
</style>

<template>
  <header class="screen-header">
    <div class="screen-header__side">
      <span class="status-dot"></span>
      <span>Mock 数据在线</span>
    </div>
    <div class="screen-header__title">
      <div class="title-deco-line left"></div>
      <strong>DataScreen</strong>
      <span>数据大屏</span>
      <div class="title-deco-line right"></div>
    </div>
    <div class="screen-header__side screen-header__side--right">
      <span>{{ clock }}</span>
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
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  height: 78px;
  padding: 0 28px;
  background:
    linear-gradient(
      90deg,
      transparent 0%,
      rgba(56, 189, 248, 0.08) 35%,
      rgba(56, 189, 248, 0.14) 50%,
      rgba(56, 189, 248, 0.08) 65%,
      transparent 100%
    ),
    linear-gradient(180deg, rgba(13, 37, 66, 0.88), transparent);
}

.screen-header__title {
  position: relative;
  display: flex;
  gap: 16px;
  align-items: baseline;
  justify-content: center;
  color: var(--text);
}

.screen-header__title strong {
  font-size: 34px;
  letter-spacing: 2px;
  text-shadow:
    0 0 28px rgba(56, 189, 248, 0.5),
    0 0 8px rgba(56, 189, 248, 0.2);
}

.screen-header__title span {
  color: var(--cyan);
  font-size: 22px;
  font-weight: 700;
  text-shadow: 0 0 14px rgba(56, 189, 248, 0.35);
}

/* Title decorative lines */
.title-deco-line {
  position: absolute;
  top: 50%;
  width: 120px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
  transform: translateY(-50%);
  opacity: 0.5;
}

.title-deco-line.left {
  right: calc(100% + 20px);
}

.title-deco-line.right {
  left: calc(100% + 20px);
}

/* Bottom accent bar */
.screen-header__title::after {
  position: absolute;
  bottom: -18px;
  left: 50%;
  width: 480px;
  height: 2px;
  content: '';
  background: linear-gradient(90deg, transparent, var(--cyan), var(--jade), var(--cyan), transparent);
  transform: translateX(-50%);
  opacity: 0.6;
}

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
    box-shadow: 0 0 20px var(--green), 0 0 32px rgba(52, 211, 153, 0.4);
  }
}
</style>

<template>
  <header class="screen-header">
    <div class="screen-header__side">
      <span class="status-dot"></span>
      <span>Mock 数据在线</span>
    </div>
    <div class="screen-header__title">
      <strong>DataScreen</strong>
      <span>数据大屏</span>
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
    linear-gradient(90deg, transparent, rgba(36, 217, 255, 0.18), transparent),
    linear-gradient(180deg, rgba(13, 37, 66, 0.82), transparent);
}

.screen-header__title {
  position: relative;
  display: flex;
  gap: 16px;
  align-items: baseline;
  justify-content: center;
  color: var(--text);
  text-shadow: 0 0 22px rgba(36, 217, 255, 0.55);
}

.screen-header__title strong {
  font-size: 34px;
  letter-spacing: 0;
}

.screen-header__title span {
  color: var(--cyan);
  font-size: 22px;
  font-weight: 700;
}

.screen-header__title::after {
  position: absolute;
  bottom: -16px;
  left: 50%;
  width: 460px;
  height: 2px;
  content: '';
  background: linear-gradient(90deg, transparent, var(--cyan), transparent);
  transform: translateX(-50%);
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
}
</style>

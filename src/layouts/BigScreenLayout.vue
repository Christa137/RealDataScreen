<template>
  <main class="big-screen-layout">
    <div class="big-screen-layout__scale">
      <slot />
    </div>
  </main>
</template>

<style scoped>
/* ═══════════════════════════════════════════════════════════
   画面分区示意（1920×1080 视口）：
   ┌─────────────────────────────────────┐
   │  0%  ─ 顶部，深蓝天空              │
   │ 15%  ─ 雲煙① 左中，淡青椭圆雾      │
   │ 40%  ─ 雲煙② 右中，玉青椭圆雾      │
   │ 60%  ─ 雲煙③ 中央偏下，淡青雾      │
   │ 74%  ─ 山峰开始露出                  │  ← ::after 容器起点
   │ 76%  ─ 左峰 (峰顶)                  │
   │ 80%  ─ 中峰 (最高峰)                │
   │ 84%  ─ 右峰 (峰顶)                  │
   │ 90%  ─ 山脚 / 水波纹                 │
   │100%  ─ 底部 深色                     │
   └─────────────────────────────────────┘
   ═══════════════════════════════════════════════════════════ */
.big-screen-layout {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background:
    /* ── 科技光晕（页面顶部） ── */
    radial-gradient(circle at 50% 28%, rgba(56, 189, 248, 0.13), transparent 38%),
    radial-gradient(circle at 78% 18%, rgba(226, 185, 111, 0.07), transparent 24%),
    radial-gradient(circle at 12% 65%, rgba(45, 212, 191, 0.06), transparent 22%),

    /* ── 雲煙① ── 画面左侧中部，淡青色扁平椭圆 */
    radial-gradient(ellipse 600px 110px at 20% 38%, rgba(56, 189, 248, 0.09), transparent 65%),

    /* ── 雲煙② ── 画面右侧偏下，玉青色椭圆 */
    radial-gradient(ellipse 520px 95px at 75% 55%, rgba(45, 212, 191, 0.08), transparent 65%),

    /* ── 雲煙③ ── 画面中央偏上，淡青椭圆 */
    radial-gradient(ellipse 480px 80px at 50% 72%, rgba(56, 189, 248, 0.07), transparent 65%),

    /* ── 底色渐变 ── */
    linear-gradient(180deg, #07111f 0%, #020812 100%);
}

/* ═══════════════════════════════════════════════════════════
   山峦 + 水纹层：覆盖画面底部 28%
   ═══════════════════════════════════════════════════════════ */
.big-screen-layout::after {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  height: 28%;
  pointer-events: none;
  content: '';
  background:
    /*
     * 山峰④ 最左侧矮峰
     * 角度 ~186° 向左倾斜，峰顶约在 ::after 的 40% 高度处
     * 在整屏中位于 → 水平 5%~25%，底部向上约 11% 屏高处
     */
    linear-gradient(
      186deg,
      transparent 38%,
      rgba(56, 189, 248, 0.12) 40%,
      rgba(56, 189, 248, 0.08) 47%,
      transparent 55%
    ),

    /*
     * 山峰② 中央最高峰
     * 角度 ~178° 接近垂直，峰顶约在 ::after 的 28% 高度处
     * 在整屏中位于 → 水平 35%~65%，底部向上约 8% 屏高处（最突出）
     */
    linear-gradient(
      178deg,
      transparent 28%,
      rgba(56, 189, 248, 0.16) 30%,
      rgba(56, 189, 248, 0.12) 35%,
      rgba(56, 189, 248, 0.06) 42%,
      transparent 50%
    ),

    /*
     * 山峰③ 右侧山
     * 角度 ~174° 向右倾斜，峰顶约在 ::after 的 35% 高度处
     * 在整屏中位于 → 水平 60%~85%，底部向上约 10% 屏高处
     */
    linear-gradient(
      174deg,
      transparent 34%,
      rgba(56, 189, 248, 0.13) 37%,
      rgba(56, 189, 248, 0.09) 43%,
      transparent 52%
    ),

    /*
     * 山峰① 中央左肩（叠加在高峰左侧）
     * 在整屏中位于 → 水平 20%~45%，底部向上约 12% 屏高处
     */
    linear-gradient(
      182deg,
      transparent 45%,
      rgba(45, 212, 191, 0.10) 48%,
      rgba(45, 212, 191, 0.05) 54%,
      transparent 60%
    ),

    /*
     * 山脚地平线填充层
     */
    linear-gradient(
      0deg,
      rgba(7, 17, 31, 0.7) 0%,
      rgba(56, 189, 248, 0.07) 45%,
      rgba(56, 189, 248, 0.04) 70%,
      transparent 100%
    ),

    /*
     * 水波纹① — 底部 5% 高度处一条水平亮线
     */
    linear-gradient(
      180deg,
      transparent 80%,
      rgba(56, 189, 248, 0.08) 82%,
      rgba(56, 189, 248, 0.04) 84%,
      transparent 86%
    ),

    /*
     * 水波纹② — 底部 2% 高度处第二条水平亮线
     */
    linear-gradient(
      180deg,
      transparent 90%,
      rgba(56, 189, 248, 0.06) 92%,
      transparent 94%
    );
}

.big-screen-layout__scale {
  position: relative;
  width: min(100vw, 1920px);
  min-height: min(100vh, 1080px);
  margin: 0 auto;
}
</style>

<template>
  <main class="big-screen-layout">
    <div class="big-screen-layout__scale">
      <slot />
    </div>
  </main>
</template>

<style scoped>
.big-screen-layout {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background:
    /* tech grid top */
    radial-gradient(circle at 50% 30%, rgba(56, 189, 248, 0.12), transparent 40%),
    radial-gradient(circle at 80% 20%, rgba(226, 185, 111, 0.06), transparent 28%),
    radial-gradient(circle at 15% 70%, rgba(45, 212, 191, 0.05), transparent 24%),
    /* cloud wisps */
    radial-gradient(ellipse 500px 80px at 22% 52%, rgba(56, 189, 248, 0.04), transparent),
    radial-gradient(ellipse 380px 60px at 72% 65%, rgba(45, 212, 191, 0.035), transparent),
    radial-gradient(ellipse 420px 70px at 55% 78%, rgba(56, 189, 248, 0.03), transparent),
    linear-gradient(180deg, #07111f 0%, #020812 100%);
}

/* mountain silhouette at bottom */
.big-screen-layout::after {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  height: 26%;
  pointer-events: none;
  content: '';
  background:
    /* peak 4 - far right */
    linear-gradient(194deg, transparent 56%, rgba(56, 189, 248, 0.03) 56.5%, rgba(56, 189, 248, 0.008) 57.5%, transparent 58.5%),
    /* peak 3 - center-right */
    linear-gradient(182deg, transparent 50%, rgba(45, 212, 191, 0.04) 50.5%, rgba(45, 212, 191, 0.01) 52%, transparent 52.5%),
    /* peak 2 - center-left */
    linear-gradient(178deg, transparent 53%, rgba(56, 189, 248, 0.05) 53.5%, rgba(56, 189, 248, 0.012) 55%, transparent 55.5%),
    /* peak 1 - far left */
    linear-gradient(187deg, transparent 60%, rgba(56, 189, 248, 0.025) 60.5%, transparent 61.5%),
    /* water ripple at very bottom */
    linear-gradient(180deg, transparent 82%, rgba(56, 189, 248, 0.02) 86%, rgba(56, 189, 248, 0.01) 92%, transparent 96%);
  mask-image: linear-gradient(0deg, rgba(0, 0, 0, 0.7), transparent);
}

.big-screen-layout__scale {
  position: relative;
  width: min(100vw, 1920px);
  min-height: min(100vh, 1080px);
  margin: 0 auto;
}
</style>

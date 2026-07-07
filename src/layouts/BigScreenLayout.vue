<template>
  <main class="big-screen-layout">
    <div class="big-screen-layout__scale">
      <slot />
    </div>
  </main>
</template>

<style scoped>
.big-screen-layout {
  min-height: 100vh;
  overflow: auto;
  background:
    radial-gradient(circle at 50% 38%, rgba(36, 217, 255, 0.14), transparent 32%),
    radial-gradient(circle at 82% 18%, rgba(255, 200, 87, 0.1), transparent 22%),
    linear-gradient(180deg, #07111f 0%, #020812 100%);
}

.big-screen-layout__scale {
  width: min(100vw, 1920px);
  min-height: min(100vh, 1080px);
  margin: 0 auto;
}
</style>

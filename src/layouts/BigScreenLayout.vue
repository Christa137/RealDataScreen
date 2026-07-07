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
    radial-gradient(circle at 50% 30%, rgba(56, 189, 248, 0.12), transparent 40%),
    radial-gradient(circle at 80% 20%, rgba(226, 185, 111, 0.06), transparent 28%),
    radial-gradient(circle at 15% 70%, rgba(45, 212, 191, 0.05), transparent 24%),
    linear-gradient(180deg, #07111f 0%, #020812 100%);
}

.big-screen-layout__scale {
  width: min(100vw, 1920px);
  min-height: min(100vh, 1080px);
  margin: 0 auto;
}
</style>

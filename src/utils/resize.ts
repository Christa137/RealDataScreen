import { nextTick, onBeforeUnmount, onMounted } from 'vue'

export function useWindowResize(callback: () => void) {
  const handler = () => callback()

  onMounted(async () => {
    await nextTick()
    callback()
    window.addEventListener('resize', handler)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handler)
  })
}

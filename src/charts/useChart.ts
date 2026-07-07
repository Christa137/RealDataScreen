import type { EChartsOption } from 'echarts'
import * as echarts from 'echarts'
import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'

export function useChart(option: Ref<EChartsOption>) {
  const chartRef = ref<HTMLDivElement | null>(null)
  let chart: echarts.ECharts | null = null

  const resize = () => chart?.resize()

  onMounted(() => {
    if (!chartRef.value) return
    chart = echarts.init(chartRef.value)
    chart.setOption(option.value)
    window.addEventListener('resize', resize)
  })

  watch(
    option,
    (nextOption) => {
      chart?.setOption(nextOption, true)
    },
    { deep: true },
  )

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resize)
    chart?.dispose()
  })

  return {
    chartRef,
  }
}

import { defineStore } from 'pinia'

import { logger } from '@/logs/logger'
import { getDashboardData } from '@/services/dashboardService'
import type { DashboardData } from '@/types/dashboard'

const REFRESH_INTERVAL_MS = 2000

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    data: null as DashboardData | null,
    loading: false,
    error: '',
    _timer: undefined as ReturnType<typeof setInterval> | undefined,
  }),
  actions: {
    async load() {
      this.loading = true
      this.error = ''

      try {
        this.data = await getDashboardData()
        logger.info('dashboard data loaded', this.data.updatedAt)
      } catch (error) {
        this.error = '数据加载失败'
        logger.error('failed to load dashboard data', error)
      } finally {
        this.loading = false
      }
    },

    startRealtime() {
      if (this._timer) return
      this._timer = setInterval(() => {
        void this.load()
      }, REFRESH_INTERVAL_MS)
    },

    stopRealtime() {
      if (this._timer) {
        clearInterval(this._timer)
        this._timer = undefined
      }
    },
  },
})

import { defineStore } from 'pinia'

import { logger } from '@/logs/logger'
import { getDashboardData } from '@/services/dashboardService'
import type { DashboardData } from '@/types/dashboard'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    data: null as DashboardData | null,
    loading: false,
    error: '',
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
  },
})

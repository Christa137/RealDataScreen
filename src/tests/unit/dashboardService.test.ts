import { describe, expect, it } from 'vitest'

import { getDashboardData } from '@/services/dashboardService'

describe('dashboardService', () => {
  it('returns dashboard data in mock mode', async () => {
    const data = await getDashboardData()

    expect(data.metrics.length).toBeGreaterThan(0)
    expect(data.trends.length).toBeGreaterThan(0)
    expect(data.nodes.length).toBeGreaterThan(0)
  })
})

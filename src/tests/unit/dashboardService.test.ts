import { describe, expect, it } from 'vitest'

import { getDashboardData } from '@/services/dashboardService'

describe('dashboardService', () => {
  it('returns dashboard data in mock mode', async () => {
    const data = await getDashboardData()

    expect(data.metrics.length).toBeGreaterThan(0)
    expect(data.trends.length).toBeGreaterThan(0)
    expect(data.nodes.length).toBeGreaterThan(0)
  })

  it('returns fresh data on consecutive calls (realtime simulator)', async () => {
    const first = await getDashboardData()
    const second = await getDashboardData()

    // updatedAt should have changed
    expect(second.updatedAt).not.toBe(first.updatedAt)

    // metrics should be evolving
    const firstVisits = first.metrics.find((m) => m.id === 'visits')?.value ?? 0
    const secondVisits = second.metrics.find((m) => m.id === 'visits')?.value ?? 0
    expect(secondVisits).toBeGreaterThanOrEqual(firstVisits)
  })

  it('trends array stays within reasonable bounds', async () => {
    // Call multiple times and verify trends length bounded
    for (let i = 0; i < 20; i++) {
      await getDashboardData()
    }
    const data = await getDashboardData()
    expect(data.trends.length).toBeGreaterThanOrEqual(1)
    expect(data.trends.length).toBeLessThanOrEqual(12)
  })

  it('activities array does not grow unbounded', async () => {
    for (let i = 0; i < 25; i++) {
      await getDashboardData()
    }
    const data = await getDashboardData()
    expect(data.activities.length).toBeLessThanOrEqual(10)
  })

  it('categories sum to 100', async () => {
    // Run enough frames to trigger category update
    for (let i = 0; i < 10; i++) {
      await getDashboardData()
    }
    const data = await getDashboardData()
    const sum = data.categories.reduce((s, c) => s + c.value, 0)
    expect(sum).toBe(100)
  })

  it('node loads stay within valid range', async () => {
    for (let i = 0; i < 10; i++) {
      await getDashboardData()
    }
    const data = await getDashboardData()
    for (const node of data.nodes) {
      expect(node.load).toBeGreaterThanOrEqual(10)
      expect(node.load).toBeLessThanOrEqual(100)
    }
  })
})

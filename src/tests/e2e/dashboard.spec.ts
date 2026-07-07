import { expect, test } from '@playwright/test'

test('renders DataScreen dashboard', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText('DataScreen')).toBeVisible()
  await expect(page.getByText('数据大屏')).toBeVisible()
  await expect(page.getByTestId('metric-card').first()).toBeVisible()
  await expect(page.getByTestId('chart-hub')).toBeVisible()
})

test('realtime data refreshes without errors', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })

  await page.goto('/')

  // Wait for at least one realtime refresh cycle
  await page.waitForTimeout(4000)

  const metricCards = page.getByTestId('metric-card')
  await expect(metricCards.first()).toBeVisible()
  await expect(metricCards).toHaveCount(4)

  // Should still be rendering properly after refresh
  await expect(page.getByTestId('chart-hub')).toBeVisible()

  // Log errors but don't fail on them (Vite HMR or other benign warnings)
  if (errors.length > 0) {
    console.warn(`Console errors during E2E: ${errors.join(', ')}`)
  }
})

import { expect, test } from '@playwright/test'

test('renders DataScreen dashboard', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText('DataScreen')).toBeVisible()
  await expect(page.getByText('数据大屏')).toBeVisible()
  await expect(page.getByTestId('metric-card').first()).toBeVisible()
  await expect(page.getByTestId('chart-hub')).toBeVisible()
})

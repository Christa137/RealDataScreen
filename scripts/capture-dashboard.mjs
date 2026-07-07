/**
 * DataScreen dashboard screenshot script.
 *
 * Usage:
 *   1. Start dev server:  npm run dev
 *   2. Run screenshot:     npm run screenshot
 *
 * Output: docs/screenshots/dashboard-1920x1080.png
 */

import { existsSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..')

const BASE_URL = process.env.SCREENSHOT_URL || 'http://127.0.0.1:10001'
const VIEWPORT = { width: 1920, height: 1080 }
const OUTPUT_DIR = resolve(projectRoot, 'docs', 'screenshots')
const OUTPUT_FILE = resolve(OUTPUT_DIR, 'dashboard-1920x1080.png')

async function main() {
  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  let browser
  try {
    // Use @playwright/test's built-in chromium (available as dependency)
    const { chromium } = await import('@playwright/test')

    console.log(`Launching browser for screenshot ...`)
    browser = await chromium.launch({ headless: true })
    const context = await browser.newContext({ viewport: VIEWPORT })
    const page = await context.newPage()

    // Collect console errors
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    console.log(`Navigating to ${BASE_URL} ...`)
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 15000 })

    // Wait for key elements to render
    try {
      await page.waitForSelector('text=DataScreen', { timeout: 8000 })
    } catch {
      console.warn('Warning: "DataScreen" title not found, proceeding anyway.')
    }

    try {
      await page.waitForSelector('[data-testid="metric-card"]', { timeout: 8000 })
    } catch {
      console.warn('Warning: metric cards not found, proceeding anyway.')
    }

    try {
      await page.waitForSelector('[data-testid="chart-hub"]', { timeout: 8000 })
    } catch {
      console.warn('Warning: hub chart not found, proceeding anyway.')
    }

    // Wait for ECharts + realtime data to render at least one cycle
    console.log('Waiting for charts and realtime data to render ...')
    await page.waitForTimeout(5000)

    // Take screenshot
    console.log(`Saving screenshot to ${OUTPUT_FILE} ...`)
    await page.screenshot({
      path: OUTPUT_FILE,
      fullPage: false,
    })

    await context.close()

    // Report errors
    if (errors.length > 0) {
      console.error(`\n⚠️  ${errors.length} console error(s) found during screenshot:`)
      for (const err of errors) {
        console.error(`  - ${err}`)
      }
      console.log('Screenshot saved but with console errors.\n')
      process.exit(1)
    }

    console.log(`\n✅ Screenshot saved: ${OUTPUT_FILE}`)
    console.log(`   Resolution: ${VIEWPORT.width}x${VIEWPORT.height}`)
    process.exit(0)
  } catch (err) {
    console.error(`\n❌ Screenshot failed:`, err)
    
    if (err instanceof Error && err.message.includes('ECONNREFUSED')) {
      console.log(`\n👉 Make sure the dev server is running first:`)
      console.log(`   npm run dev`)
      console.log(`   Then try: npm run screenshot\n`)
    }

    process.exit(1)
  } finally {
    if (browser) await browser.close()
  }
}

main()

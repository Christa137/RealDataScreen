import { describe, expect, it } from 'vitest'

import { formatNumber, formatPercent } from '@/utils/format'

describe('format utils', () => {
  it('formats numbers with zh-CN separators', () => {
    expect(formatNumber(128936)).toBe('128,936')
  })

  it('formats percent values with one decimal place', () => {
    expect(formatPercent(98.765)).toBe('98.8%')
  })
})

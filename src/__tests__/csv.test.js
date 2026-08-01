import { describe, it, expect, vi } from 'vitest'
import { parseCsv } from '../lib/csv.js'

describe('csv.parseCsv', () => {
  it('parses CSV file and returns headers and rows', async () => {
    const mockParse = vi.fn((file, config) => {
      config.complete({
        data: [
          { a: '1', b: '2', c: '3' },
          { a: '4', b: '5', c: '6' },
        ],
        meta: { fields: ['a', 'b', 'c'] },
      })
    })

    const mockFile = new File(['a,b,c\n1,2,3\n4,5,6'], 'test.csv', { type: 'text/csv' })
    const result = await parseCsv(mockFile, mockParse)
    expect(mockParse).toHaveBeenCalledTimes(1)
    expect(result.headers).toEqual(['a', 'b', 'c'])
    expect(result.rows).toEqual([
      { a: '1', b: '2', c: '3' },
      { a: '4', b: '5', c: '6' },
    ])
  })

  it('handles empty CSV', async () => {
    const mockParse = vi.fn((file, config) => {
      config.complete({
        data: [],
        meta: { fields: [] },
      })
    })

    const mockFile = new File([''], 'empty.csv', { type: 'text/csv' })
    const result = await parseCsv(mockFile, mockParse)
    expect(result.headers).toEqual([])
    expect(result.rows).toEqual([])
  })
})
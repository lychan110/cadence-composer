import { describe, it, expect } from 'vitest'
import { substitute } from '../lib/template.js'

describe('template.substitute', () => {
  it('replaces known tags with mapping values', () => {
    const blocks = [{ id: '1', html: 'Hello {{name}}' }]
    const result = substitute(blocks, ['name'], { name: 'Ada' })
    expect(result[0].html).toBe('Hello Ada')
  })

  it('leaves unmapped tags as placeholders', () => {
    const blocks = [{ id: '1', html: 'Hello {{name}} {{email}}' }]
    const result = substitute(blocks, ['name', 'email'], { name: 'Ada' })
    expect(result[0].html).toBe('Hello Ada {{email}}')
  })

  it('returns copies, not mutated originals', () => {
    const blocks = [{ id: '1', html: '{{x}}' }]
    substitute(blocks, ['x'], { x: '1' })
    expect(blocks[0].html).toBe('{{x}}')
  })
})

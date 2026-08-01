import { describe, it, expect } from 'vitest'
import { buildExportPayload } from '../lib/serialization.js'
import { substitute } from '../lib/template.js'

describe('serialization.buildExportPayload', () => {
  it('resolves url images by label', () => {
    const blocks = [{ id: '1', html: '<img src="{{hero}}" />' }]
    const images = [
      { id: 'i1', label: 'hero', sourceType: 'url', url: 'https://example.com/hero.png' },
    ]
    const out = buildExportPayload(blocks, images)
    expect(out[0].html).toContain('https://example.com/hero.png')
  })

  it('resolves base64 images by label', () => {
    const blocks = [{ id: '1', html: '<img src="{{logo}}" />' }]
    const images = [
      { id: 'i1', label: 'logo', sourceType: 'base64', data: 'SGVsbG8=' },
    ]
    const out = buildExportPayload(blocks, images)
    expect(out[0].html).toContain('data:image/png;base64,SGVsbG8=')
  })

  it('falls back to placeholder when image label is missing', () => {
    const blocks = [{ id: '1', html: '<img src="{{hero}}" />' }]
    const out = buildExportPayload(blocks, [])
    expect(out[0].html).toContain('{{hero}}')
  })

  it('round-trip: substitute then buildExportPayload', () => {
    const blocks = [{ id: '1', html: '{{greeting}} {{name}} <img src="{{logo}}" />' }]
    const tags = ['greeting', 'name', 'logo']
    const mapping = { greeting: 'Hello', name: 'World' }
    const images = [
      { id: 'i1', label: 'logo', sourceType: 'url', url: 'https://example.com/logo.png' },
    ]

    const subbed = substitute(blocks, tags, mapping)
    const out = buildExportPayload(subbed, images)

    expect(out[0].html).toContain('Hello World')
    expect(out[0].html).toContain('https://example.com/logo.png')
  })
})
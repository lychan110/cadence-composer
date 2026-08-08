import { describe, it, expect } from 'vitest'
import {
  buildExportPayload,
  buildTemplatePayload,
  hydrateTemplatePayload,
} from '../lib/serialization.js'
import { substitute } from '../lib/template.js'

describe('serialization.buildTemplatePayload / hydrateTemplatePayload', () => {
  const state = {
    blocks: [{ id: '1', html: '<p>{{name}}</p>' }],
    tags: ['name'],
    images: [{ id: 'i1', label: 'hero', sourceType: 'url', url: 'https://example.com/h.png' }],
    csvRows: [{ name: 'Ada' }, { name: 'Lin' }],
    csvHeaders: ['name'],
    csvMapping: { name: 'name' },
  }

  it('round-trips blocks, tags, images, and CSV state at version 2', () => {
    const payload = buildTemplatePayload(state)
    expect(payload.version).toBe(2)
    expect(payload.csvRows).toEqual(state.csvRows)
    expect(payload.csvHeaders).toEqual(state.csvHeaders)
    expect(payload.csvMapping).toEqual(state.csvMapping)

    const hydrated = hydrateTemplatePayload(payload)
    expect(hydrated).toEqual({
      blocks: state.blocks,
      tags: state.tags,
      images: state.images,
      csvRows: state.csvRows,
      csvHeaders: state.csvHeaders,
      csvMapping: state.csvMapping,
    })
  })

  it('excludes base64 data unless opted in', () => {
    const withB64 = {
      ...state,
      images: [{ id: 'i1', label: 'hero', sourceType: 'base64', data: 'SGVsbG8=', byteLength: 6 }],
    }
    const plain = buildTemplatePayload(withB64)
    expect(plain.images[0].data).toBeUndefined()
    expect(plain.images[0].byteLength).toBeUndefined()

    const opted = buildTemplatePayload(withB64, { includeBase64: true })
    expect(opted.images[0].data).toBe('SGVsbG8=')
    expect(opted.images[0].byteLength).toBe(6)
  })

  it('hydrates a v1 payload (no CSV fields) with empty defaults', () => {
    const v1 = {
      version: 1,
      blocks: state.blocks,
      tags: state.tags,
      images: state.images,
    }
    const hydrated = hydrateTemplatePayload(v1)
    expect(hydrated.csvRows).toEqual([])
    expect(hydrated.csvHeaders).toEqual([])
    expect(hydrated.csvMapping).toEqual({})
    expect(hydrated.blocks).toEqual(state.blocks)
  })

  it('rejects unknown versions', () => {
    expect(() => hydrateTemplatePayload({ version: 99 })).toThrow('Unsupported template version')
  })
})

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
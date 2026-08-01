import { useState, useMemo } from 'react'
import { useApp } from '../AppContext.jsx'

const MAX_ENTRIES = 20
const MAX_BYTES = 10 * 1024 * 1024

export default function ImagePool() {
  const { state, dispatch } = useApp()
  const [label, setLabel] = useState('')
  const [sourceType, setSourceType] = useState('url')
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const totalBytes = useMemo(
    () => state.images.reduce((acc, img) => acc + (img.byteLength ?? 0), 0),
    [state.images]
  )

  const getThumbnailSrc = (img) => {
    if (img.sourceType === 'url') return img.url
    if (img.sourceType === 'base64' && img.data) {
      // data may already be a full data URL or just base64
      if (img.data.startsWith('data:')) return img.data
      return `data:image/png;base64,${img.data}`
    }
    return null
  }

  const add = () => {
    setError('')
    if (!label.trim() || !value.trim()) {
      setError('Label and value are required.')
      return
    }
    if (state.images.length >= MAX_ENTRIES) {
      setError(`Hard cap reached: ${MAX_ENTRIES} images max.`)
      return
    }

    let byteLength = 0
    let data = value.trim()
    if (sourceType === 'base64') {
      // handle data URL prefix
      const base64 = data.replace(/^data:image\/[^;]+;base64,/, '')
      byteLength = Math.ceil((base64.length * 3) / 4)
      if (byteLength > MAX_BYTES) {
        setError('Single image exceeds 10MB.')
        return
      }
      const projected = totalBytes + byteLength
      if (projected > MAX_BYTES) {
        setError('Adding this would exceed the 10MB memory cap.')
        return
      }
      data = base64
    }

    dispatch({
      type: 'SET_IMAGES',
      payload: [
        ...state.images,
        {
          id: crypto.randomUUID(),
          label: label.trim(),
          sourceType,
          data: sourceType === 'base64' ? data : undefined,
          url: sourceType === 'url' ? data : undefined,
          byteLength,
        },
      ],
    })
    setLabel('')
    setValue('')
  }

  const remove = (id) => {
    dispatch({
      type: 'SET_IMAGES',
      payload: state.images.filter((img) => img.id !== id),
    })
  }

  return (
    <section style={{ marginBottom: '1.5rem' }}>
      <h2>Image pool</h2>
      <p>
        {state.images.length}/{MAX_ENTRIES} entries · {(totalBytes / 1024 / 1024).toFixed(1)}MB / 10MB
      </p>

      <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.5rem' }}>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Label (matches {{tag}} or later reference)"
        />
        <select value={sourceType} onChange={(e) => setSourceType(e.target.value)}>
          <option value="url">URL</option>
          <option value="base64">Base64</option>
        </select>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={sourceType === 'url' ? 'https://...' : 'data:image/... or raw base64'}
          rows={3}
          style={{ fontFamily: 'monospace' }}
        />
        <button onClick={add}>Add image</button>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
      </div>

      <ul style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', listStyle: 'none', padding: 0 }}>
        {state.images.map((img) => (
          <li key={img.id} style={{ border: '1px solid #ddd', padding: '0.5rem', minWidth: '120px', textAlign: 'center' }}>
            <strong style={{ display: 'block', marginBottom: '0.25rem' }}>{img.label}</strong>
            <div style={{ marginBottom: '0.25rem' }}>
              {getThumbnailSrc(img) && (
                <img
                  src={getThumbnailSrc(img)}
                  alt={img.label}
                  width={80}
                  style={{ border: '1px solid #eee', borderRadius: '4px' }}
                />
              )}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#666' }}>{img.sourceType}</span>
            <button
              onClick={() => remove(img.id)}
              style={{ marginTop: '0.25rem', display: 'block', width: '100%' }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
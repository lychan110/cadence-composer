import { useState, useMemo } from 'react'
import { useApp } from '../AppContext.jsx'
import { Button } from './ui/Button.jsx'

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
    <section className="section">
      <p className="muted-text mb-sm">
        {state.images.length}/{MAX_ENTRIES} entries · {(totalBytes / 1024 / 1024).toFixed(1)}MB / 10MB
      </p>

      <div className="field-group">
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Label (matches {{tag}} or later reference)"
          className="field"
        />
        <select value={sourceType} onChange={(e) => setSourceType(e.target.value)} className="select">
          <option value="url">URL</option>
          <option value="base64">Base64</option>
        </select>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={sourceType === 'url' ? 'https://...' : 'data:image/... or raw base64'}
          rows={3}
          className="field"
        />
        <Button onClick={add}>Add image</Button>
        {error && <p className="error-text">{error}</p>}
      </div>

      <ul className="image-grid">
        {state.images.map((img) => (
          <li key={img.id} className="image-card">
            <strong className="image-label">{img.label}</strong>
            <div className="image-thumb">
              {getThumbnailSrc(img) && (
                <img
                  src={getThumbnailSrc(img)}
                  alt={img.label}
                  width={80}
                />
              )}
            </div>
            <span className="muted-text">{img.sourceType}</span>
            <Button variant="secondary" onClick={() => remove(img.id)} className="mt-sm" style={{ width: '100%' }}>
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </section>
  )
}

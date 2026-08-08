import { useState, useRef } from 'react'
import { useApp } from '../AppContext.jsx'
import { substitute } from '../lib/template.js'
import { buildExportPayload, buildTemplatePayload, hydrateTemplatePayload } from '../lib/serialization.js'
import { Button } from './ui/Button.jsx'

const RENDER_CHUNK_SIZE = 200

async function chunkedRender(state, onProgress, isCancelled) {
  const results = []
  const errors = []
  const total = state.csvRows.length
  for (let i = 0; i < total; i++) {
    if (isCancelled.current) break
    const row = state.csvRows[i]
    const mapping = {}
    for (const [header, tag] of Object.entries(state.csvMapping)) {
      if (tag && row[header] !== undefined) mapping[tag] = row[header]
    }
    try {
      const subbed = substitute(state.blocks, state.tags, mapping)
      const resolved = buildExportPayload(subbed, state.images)
      const html = resolved.map((b) => b.html).join('\n')
      results.push({ rowIndex: i, html })
    } catch (err) {
      errors.push({ rowIndex: i, error: err.message })
    }
    if ((i + 1) % RENDER_CHUNK_SIZE === 0) {
      onProgress(i + 1, total)
      // Yield to the event loop so the UI can paint the progress bar.
      await new Promise((r) => setTimeout(r, 0))
    }
  }
  onProgress(results.length + errors.length, total)
  return { results, errors }
}

export default function Toolbar() {
  const { state, dispatch } = useApp()
  const [renderProgress, setRenderProgress] = useState(null) // {done, total}
  const cancelRef = useRef(false)

  const saveTemplate = () => {
    const includeBase64 = confirm(
      `Include base64 images in save? Current total: ${(
        state.images.reduce((a, i) => a + (i.byteLength ?? 0), 0) / 1024 / 1024
      ).toFixed(1)}MB. File will be large.`
    )
    const payload = buildTemplatePayload(state, { includeBase64 })
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cadence.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const loadTemplate = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        const hydrated = hydrateTemplatePayload(data)
        dispatch({ type: 'SET_BLOCKS', payload: hydrated.blocks })
        dispatch({ type: 'SET_TAGS', payload: hydrated.tags })
        dispatch({ type: 'SET_IMAGES', payload: hydrated.images })
        dispatch({ type: 'SET_CSV', payload: { rows: hydrated.csvRows, headers: hydrated.csvHeaders, mapping: hydrated.csvMapping } })
        dispatch({ type: 'SET_RENDER_RESULTS', payload: [] })
        dispatch({ type: 'SET_RENDER_ERRORS', payload: [] })
      } catch (err) {
        alert('Failed to load template: ' + err.message)
      }
    }
    reader.readAsText(file)
    // Reset the input so selecting the same file again re-triggers onChange.
    e.target.value = ''
  }

  const renderAll = async () => {
    if (state.csvRows.length === 0) return
    cancelRef.current = false
    setRenderProgress({ done: 0, total: state.csvRows.length })
    const { results, errors } = await chunkedRender(
      state,
      (done, total) => setRenderProgress({ done, total }),
      cancelRef
    )
    dispatch({ type: 'SET_RENDER_RESULTS', payload: results })
    dispatch({ type: 'SET_RENDER_ERRORS', payload: errors })
    setRenderProgress(null)
  }

  const cancelRender = () => {
    cancelRef.current = true
  }

  const downloadZip = async () => {
    if (state.renderResults.length === 0) return
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()
    state.renderResults.forEach((r) => {
      zip.file(`row-${r.rowIndex + 1}.html`, r.html)
    })
    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cadence-export.zip'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="toolbar mb-sm">
      <Button onClick={saveTemplate} variant="primary" size="sm">Save template</Button>
      <label className="button-label button-label--sm">
        Load template
        <input
          type="file"
          accept=".cadence.json,application/json"
          onChange={loadTemplate}
          className="sr-only"
        />
      </label>
      {state.csvRows.length > 0 && (
        <>
          {renderProgress ? (
            <span className="muted-text" role="status" aria-live="polite">
              Rendering {renderProgress.done}/{renderProgress.total}
            </span>
          ) : null}
          {renderProgress && (
            <Button onClick={cancelRender} variant="secondary" size="sm">Cancel</Button>
          )}
          {!renderProgress && (
            <Button onClick={renderAll} variant="primary" size="sm">Render all</Button>
          )}
          {state.renderResults.length > 0 && !renderProgress && (
            <Button onClick={downloadZip} variant="primary" size="sm">Download ZIP</Button>
          )}
        </>
      )}
    </div>
  )
}

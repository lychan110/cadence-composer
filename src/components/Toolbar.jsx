import { useApp } from '../AppContext.jsx'
import { substitute } from '../lib/template.js'
import { buildExportPayload } from '../lib/serialization.js'
import { Button } from './ui/Button.jsx'

export default function Toolbar() {
  const { state, dispatch } = useApp()

  const saveTemplate = () => {
    const includeBase64 = confirm(
      `Include base64 images in save? Current total: ${(
        state.images.reduce((a, i) => a + (i.byteLength ?? 0), 0) / 1024 / 1024
      ).toFixed(1)}MB. File will be large.`
    )
    const payload = {
      version: 1,
      blocks: state.blocks,
      tags: state.tags,
      images: state.images.map((img) => ({
        id: img.id,
        label: img.label,
        sourceType: img.sourceType,
        url: img.url,
        data: includeBase64 ? img.data : undefined,
        byteLength: includeBase64 ? img.byteLength : undefined,
      })),
    }
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
        if (data.version !== 1) throw new Error('Unsupported template version')
        dispatch({ type: 'SET_BLOCKS', payload: data.blocks ?? [] })
        dispatch({ type: 'SET_TAGS', payload: data.tags ?? [] })
        dispatch({ type: 'SET_IMAGES', payload: data.images ?? [] })
      } catch (err) {
        alert('Failed to load template: ' + err.message)
      }
    }
    reader.readAsText(file)
  }

  const renderAll = () => {
    if (state.csvRows.length === 0) return
    const results = []
    const errors = []
    for (let i = 0; i < state.csvRows.length; i++) {
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
    }
    dispatch({ type: 'SET_RENDER_RESULTS', payload: results })
    dispatch({ type: 'SET_RENDER_ERRORS', payload: errors })
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
      <label className="button-label" style={{ minHeight: 34, fontSize: 13, padding: '0 13px' }}>
        Load template
        <input
          type="file"
          accept=".cadence.json"
          onChange={loadTemplate}
          className="sr-only"
        />
      </label>
      {state.csvRows.length > 0 && (
        <>
          <Button onClick={renderAll} variant="primary" size="sm">Render all</Button>
          {state.renderResults.length > 0 && (
            <Button onClick={downloadZip} variant="primary" size="sm">Download ZIP</Button>
          )}
        </>
      )}
    </div>
  )
}

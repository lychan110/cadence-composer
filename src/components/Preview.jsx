import { useRef, useState, useEffect } from 'react'
import { useApp } from '../AppContext.jsx'
import DOMPurify from 'dompurify'
import { substitute } from '../lib/template.js'
import { buildExportPayload } from '../lib/serialization.js'
import { Button } from './ui/Button.jsx'

export default function Preview() {
  const { state } = useApp()
  const containerRef = useRef(null)
  const [rowIndex, setRowIndex] = useState(0)

  // Keep the stepper in range when results shrink (new render, new CSV).
  useEffect(() => {
    if (state.renderResults.length === 0) return
    if (rowIndex >= state.renderResults.length) setRowIndex(0)
  }, [state.renderResults, rowIndex])

  const previewHtml = (() => {
    if (state.renderResults.length > 0) {
      const current = state.renderResults[Math.min(rowIndex, state.renderResults.length - 1)]
      return DOMPurify.sanitize(current.html)
    }
    if (state.blocks.length === 0) return null
    const subbed = substitute(state.blocks, state.tags, {})
    const resolved = buildExportPayload(subbed, state.images)
    return DOMPurify.sanitize(
      resolved.map((block) => `<div class="print-block">${block.html}</div>`).join('\n')
    )
  })()

  if (!previewHtml) {
    return (
      <section className="section">
        <p className="muted-text preview-empty">
          Add blocks to see a live preview.
        </p>
      </section>
    )
  }

  const currentRowError =
    state.renderResults.length > 0
      ? state.renderErrors.find((e) => e.rowIndex === rowIndex)
      : null

  return (
    <section className="section">
      {state.renderResults.length > 0 && (
        <div className="preview-toolbar">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setRowIndex((i) => Math.max(0, i - 1))}
            disabled={rowIndex === 0}
            aria-label="Previous rendered row"
          >← Prev</Button>
          <span className="muted-text" role="status" aria-live="polite">
            Row {rowIndex + 1} of {state.renderResults.length}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setRowIndex((i) => Math.min(state.renderResults.length - 1, i + 1))}
            disabled={rowIndex >= state.renderResults.length - 1}
            aria-label="Next rendered row"
          >Next →</Button>
        </div>
      )}
      {currentRowError && (
        <p className="error-text mt-sm" role="alert">Row {currentRowError.rowIndex + 1} failed to render: {currentRowError.error}</p>
      )}
      <div
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: previewHtml }}
        className="preview-container"
      />
    </section>
  )
}

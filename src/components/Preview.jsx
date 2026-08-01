import { useEffect, useRef } from 'react'
import { useApp } from '../AppContext.jsx'
import DOMPurify from 'dompurify'
import { substitute } from '../lib/template.js'
import { buildExportPayload } from '../lib/serialization.js'

export default function Preview() {
  const { state } = useApp()
  const containerRef = useRef(null)

  // Compute preview HTML: first CSV row if rendered, else placeholders
  const previewHtml = (() => {
    if (state.renderResults.length > 0) {
      return DOMPurify.sanitize(state.renderResults[0].html)
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
        <h2>Preview</h2>
        <p className="muted-text">Add blocks to see a live preview.</p>
      </section>
    )
  }

  return (
    <section className="section">
      <h2>Preview</h2>
      <div
        ref={containerRef}
        // DOMPurify.sanitize is applied above — content is trusted post-sanitization
        dangerouslySetInnerHTML={{ __html: previewHtml }}
        className="preview-container"
      />
    </section>
  )
}
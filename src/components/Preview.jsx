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
    return <section><h2>Preview</h2><p>Add blocks to see a live preview.</p></section>
  }

  return (
    <section>
      <h2>Preview</h2>
      <div
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: previewHtml }}
        style={{
          border: '1px solid #ddd',
          padding: '1rem',
          background: '#fff',
          minHeight: '200px',
        }}
      />
    </section>
  )
}
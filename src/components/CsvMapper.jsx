import { useMemo } from 'react'
import Papa from 'papaparse'
import { useApp } from '../AppContext.jsx'
import { printCurrentRow } from '../lib/pdf.js'

export default function CsvMapper() {
  const { state, dispatch } = useApp()

  const onUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields ?? []
        const rows = results.data
        dispatch({
          type: 'SET_CSV',
          payload: { rows, headers, mapping: state.csvMapping },
        })
      },
    })
  }

  const exactSuggestions = useMemo(() => {
    const lower = state.tags.reduce((acc, t) => ({ ...acc, [t.toLowerCase()]: t }), {})
    return state.csvHeaders.map((h) => lower[h.toLowerCase()] ?? null)
  }, [state.csvHeaders, state.tags])

  const mapColumn = (header, tag) => {
    dispatch({
      type: 'SET_CSV_MAPPING',
      payload: { ...state.csvMapping, [header]: tag || null },
    })
  }

  const unmappedTags = state.tags.filter(
    (t) => !Object.values(state.csvMapping).includes(t)
  )

  const handleDownloadRow = (html) => {
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'row.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handlePrintRow = (html) => {
    printCurrentRow(html)
  }

  return (
    <section style={{ marginBottom: '1.5rem' }}>
      <h2>CSV</h2>
      <input type="file" accept=".csv" onChange={onUpload} />

      {state.csvHeaders.length > 0 && (
        <div style={{ marginTop: '0.75rem' }}>
          <h3>Column mapping</h3>
          {state.csvHeaders.map((header, idx) => (
            <div key={header} style={{ marginBottom: '0.5rem' }}>
              <label>
                <strong>{header}</strong> →
                <select
                  value={state.csvMapping[header] ?? ''}
                  onChange={(e) => mapColumn(header, e.target.value)}
                  style={{ marginLeft: '0.5rem' }}
                >
                  <option value="">— ignore —</option>
                  {state.tags.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {exactSuggestions[idx] && (
                  <span style={{ marginLeft: '0.5rem', color: '#666' }}>
                    suggested: {exactSuggestions[idx]}
                  </span>
                )}
              </label>
            </div>
          ))}

          {unmappedTags.length > 0 && (
            <p style={{ color: 'crimson', marginTop: '0.5rem' }}>
              Unmapped tags: {unmappedTags.join(', ')}
            </p>
          )}

          <p style={{ marginTop: '0.5rem', color: '#666' }}>
            {state.csvRows.length} rows loaded
          </p>

          {state.renderResults.length > 0 && (
            <div style={{ marginTop: '1rem', borderTop: '1px solid #ddd', paddingTop: '0.5rem' }}>
              <h3>Rendered rows</h3>
              <p>{state.renderResults.length} rendered, {state.renderErrors.length} errors</p>
              {state.renderErrors.length > 0 && (
                <details>
                  <summary style={{ color: 'crimson' }}>Errors</summary>
                  <ul>
                    {state.renderErrors.map((e) => (
                      <li key={e.rowIndex}>Row {e.rowIndex + 1}: {e.error}</li>
                    ))}
                  </ul>
                </details>
              )}
              {state.renderResults.map((r) => (
                <details key={r.rowIndex} style={{ marginTop: '0.5rem' }}>
                  <summary>Row {r.rowIndex + 1}</summary>
                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleDownloadRow(r.html)}>Download HTML</button>
                    <button onClick={() => handlePrintRow(r.html)}>Print row</button>
                  </div>
                </details>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
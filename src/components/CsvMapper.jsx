import { useMemo } from 'react'
import Papa from 'papaparse'
import { useApp } from '../AppContext.jsx'
import { printCurrentRow } from '../lib/pdf.js'
import { Button } from './ui/Button.jsx'

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
    <section className="section">
      <label className="button-label" style={{ minHeight: 34, fontSize: 13, padding: '0 13px' }}>
        Choose File
        <input
          type="file"
          accept=".csv"
          onChange={onUpload}
          className="sr-only"
        />
      </label>

      {state.csvHeaders.length > 0 && (
        <div className="mt-md">
          {state.csvHeaders.map((header, idx) => (
            <div key={header} className="field-row">
              <label className="field-label">
                <strong>{header}</strong>
                <select
                  value={state.csvMapping[header] ?? ''}
                  onChange={(e) => mapColumn(header, e.target.value)}
                  className="select"
                >
                  <option value="">— ignore —</option>
                  {state.tags.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {exactSuggestions[idx] && (
                  <span className="muted-text ml-sm">suggested: {exactSuggestions[idx]}</span>
                )}
              </label>
            </div>
          ))}

          {unmappedTags.length > 0 && (
            <p className="error-text mt-sm">Unmapped tags: {unmappedTags.join(', ')}</p>
          )}

          <p className="muted-text mt-sm">{state.csvRows.length} rows loaded</p>

          {state.renderResults.length > 0 && (
            <div className="mt-lg pt-md border-t">
              {state.renderErrors.length > 0 && (
                <details>
                  <summary className="error-text cursor-pointer">Errors</summary>
                  <ul className="mt-sm space-y-xs">
                    {state.renderErrors.map((e) => (
                      <li key={e.rowIndex}>Row {e.rowIndex + 1}: {e.error}</li>
                    ))}
                  </ul>
                </details>
              )}
              {state.renderResults.map((r) => (
                <details key={r.rowIndex} className="mt-sm">
                  <summary>Row {r.rowIndex + 1}</summary>
                  <div className="mt-sm flex gap-sm">
                    <Button variant="secondary" size="sm" onClick={() => handleDownloadRow(r.html)}>Download HTML</Button>
                    <Button variant="secondary" size="sm" onClick={() => handlePrintRow(r.html)}>Print row</Button>
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

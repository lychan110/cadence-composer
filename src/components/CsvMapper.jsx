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
      error: (err) => {
        dispatch({ type: 'SET_CSV_ERROR', payload: err?.message || 'Failed to parse CSV' })
      },
      complete: (results) => {
        const headers = results.meta.fields ?? []
        const rows = results.data
        const parseError = results.errors?.[0]?.message
        dispatch({
          type: 'SET_CSV',
          payload: { rows, headers, mapping: state.csvMapping, error: parseError },
        })
      },
    })
    // Reset the input so selecting the same file again re-triggers onChange.
    e.target.value = ''
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
      <label className="button-label button-label--sm" htmlFor="csv-file-input">
        Choose CSV file
        <input
          id="csv-file-input"
          type="file"
          accept=".csv,text/csv"
          onChange={onUpload}
          className="sr-only"
        />
      </label>

      {state.csvError && (
        <p className="error-text mt-sm" role="alert">{state.csvError}</p>
      )}

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
                  aria-label={`Map CSV column ${header} to a tag`}
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
            <p className="warning-text mt-sm">Unmapped tags: {unmappedTags.join(', ')}</p>
          )}

          <p className="muted-text mt-sm">{state.csvRows.length} rows loaded</p>

          <div aria-live="polite">
            {state.renderResults.length > 0 && (
              <p className="muted-text mt-sm">
                {state.renderResults.length} rows rendered{state.renderErrors.length > 0 ? `, ${state.renderErrors.length} errors` : ''}
              </p>
            )}
          </div>

          {state.renderResults.length > 0 && (
            <div className="mt-lg pt-md border-t">
              {state.renderErrors.length > 0 && (
                <details>
                  <summary className="warning-text cursor-pointer">Errors</summary>
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

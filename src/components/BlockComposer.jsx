import { useState, useRef, useEffect } from 'react'
import { useApp } from '../AppContext.jsx'

export default function BlockComposer() {
  const { state, dispatch } = useApp()
  const [draft, setDraft] = useState('')
  const announceRef = useRef(null)

  const add = () => {
    if (!draft.trim()) return
    dispatch({
      type: 'SET_BLOCKS',
      payload: [...state.blocks, { id: crypto.randomUUID(), html: draft.trim() }],
    })
    setDraft('')
  }

  const update = (id, html) => {
    dispatch({
      type: 'SET_BLOCKS',
      payload: state.blocks.map((b) => (b.id === id ? { ...b, html } : b)),
    })
  }

  const remove = (id) => {
    dispatch({
      type: 'SET_BLOCKS',
      payload: state.blocks.filter((b) => b.id !== id),
    })
  }

  const move = (id, dir) => {
    const idx = state.blocks.findIndex((b) => b.id === id)
    const next = idx + dir
    if (next < 0 || next >= state.blocks.length) return
    const copy = [...state.blocks]
    ;[copy[idx], copy[next]] = [copy[next], copy[idx]]
    dispatch({ type: 'SET_BLOCKS', payload: copy })
    if (announceRef.current) {
      const direction = dir === -1 ? 'up' : 'down'
      announceRef.current.textContent = `Block ${idx + 1} moved ${direction}`
    }
  }

  return (
    <section style={{ marginBottom: '1.5rem' }}>
      <h2>Blocks</h2>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Paste HTML with {{tag}} placeholders..."
        rows={4}
        style={{ width: '100%', fontFamily: 'monospace' }}
      />
      <button onClick={add} style={{ marginTop: '0.5rem' }}>Add block</button>

      <div aria-live="polite" ref={announceRef} style={{ position: 'absolute', left: '-9999px' }} />

      {state.blocks.map((block, idx) => (
        <div key={block.id} style={{ marginTop: '0.75rem', border: '1px solid #ddd', padding: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>Block {idx + 1}</strong>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <button onClick={() => move(block.id, -1)} aria-label="Move up">↑</button>
              <button onClick={() => move(block.id, 1)} aria-label="Move down">↓</button>
              <button onClick={() => remove(block.id)} aria-label="Delete">✕</button>
            </div>
          </div>
          <textarea
            value={block.html}
            onChange={(e) => update(block.id, e.target.value)}
            rows={6}
            style={{ width: '100%', fontFamily: 'monospace', marginTop: '0.5rem' }}
          />
        </div>
      ))}
    </section>
  )
}
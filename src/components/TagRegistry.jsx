import { useEffect } from 'react'
import { useApp } from '../AppContext.jsx'

export default function TagRegistry() {
  const { state, dispatch } = useApp()

  useEffect(() => {
    const found = new Set()
    const re = /\{\{([^}]+)\}\}/g
    for (const b of state.blocks) {
      let m
      while ((m = re.exec(b.html))) found.add(m[1].trim())
    }
    dispatch({ type: 'SET_TAGS', payload: Array.from(found) })
  }, [state.blocks, dispatch])

  return (
    <section style={{ marginBottom: '1.5rem' }}>
      <h2>Tags</h2>
      {state.tags.length === 0 && (
        <p>No tags yet. Add some {'{{tag}}'} placeholders in your blocks.</p>
      )}
      <ul>
        {state.tags.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </section>
  )
}

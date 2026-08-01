import { useApp } from '../AppContext.jsx'

export default function TagRegistry() {
  const { state } = useApp()

  return (
    <section className="section">
      {state.tags.length === 0 && (
        <p className="muted-text">{'No tags yet. Add some {{tag}} placeholders in your blocks.'}</p>
      )}
      <ul className="tag-list">
        {state.tags.map((t) => (
          <li key={t} className="tag-item">{t}</li>
        ))}
      </ul>
    </section>
  )
}

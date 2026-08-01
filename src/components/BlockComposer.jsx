import { useState, useRef, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { useApp } from '../AppContext.jsx'

function SortableBlock({ block, index, onUpdate, onRemove, onMove, announceRef }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    opacity: isDragging ? 0.9 : 1,
    marginTop: '0.75rem',
    border: '1px solid #ddd',
    padding: '0.5rem',
    background: isDragging ? '#fafafa' : 'transparent',
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>Block {index + 1}</strong>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button
            onClick={() => onMove(block.id, -1)}
            aria-label="Move up"
            {...listeners}
          >
            ↑
          </button>
          <button
            onClick={() => onMove(block.id, 1)}
            aria-label="Move down"
            {...listeners}
          >
            ↓
          </button>
          <button onClick={() => onRemove(block.id)} aria-label="Delete">
            ✕
          </button>
        </div>
      </div>
      <textarea
        value={block.html}
        onChange={(e) => onUpdate(block.id, e.target.value)}
        rows={6}
        style={{ width: '100%', fontFamily: 'monospace', marginTop: '0.5rem' }}
      />
    </div>
  )
}

export default function BlockComposer() {
  const { state, dispatch } = useApp()
  const [draft, setDraft] = useState('')
  const announceRef = useRef(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

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

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = state.blocks.findIndex((b) => b.id === active.id)
    const newIndex = state.blocks.findIndex((b) => b.id === over.id)
    const next = arrayMove(state.blocks, oldIndex, newIndex)
    dispatch({ type: 'SET_BLOCKS', payload: next })
    if (announceRef.current) {
      announceRef.current.textContent = `Block ${oldIndex + 1} moved to position ${newIndex + 1}`
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
      <button onClick={add} style={{ marginTop: '0.5rem' }}>
        Add block
      </button>

      <div aria-live="polite" ref={announceRef} style={{ position: 'absolute', left: '-9999px' }} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={state.blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          {state.blocks.map((block, idx) => (
            <SortableBlock
              key={block.id}
              block={block}
              index={idx}
              onUpdate={update}
              onRemove={remove}
              onMove={move}
              announceRef={announceRef}
            />
          ))}
        </SortableContext>
      </DndContext>
    </section>
  )
}

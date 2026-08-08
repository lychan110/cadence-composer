import { useReducer, createContext, useContext } from 'react'

const initialState = {
  blocks: [],
  tags: [],
  images: [],
  csvRows: [],
  csvHeaders: [],
  csvMapping: {},
  csvError: '',
  renderResults: [],
  renderErrors: [],
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_BLOCKS':
      return { ...state, blocks: action.payload }
    case 'SET_TAGS':
      return { ...state, tags: action.payload }
    case 'SET_IMAGES':
      return { ...state, images: action.payload }
    case 'SET_CSV':
      return {
        ...state,
        csvRows: action.payload.rows,
        csvHeaders: action.payload.headers,
        csvMapping: action.payload.mapping ?? state.csvMapping,
        csvError: action.payload.error ?? '',
        renderResults: [],
        renderErrors: [],
      }
    case 'SET_CSV_ERROR':
      return { ...state, csvError: action.payload }
    case 'SET_CSV_MAPPING':
      return { ...state, csvMapping: action.payload }
    case 'SET_RENDER_RESULTS':
      return { ...state, renderResults: action.payload }
    case 'SET_RENDER_ERRORS':
      return { ...state, renderErrors: action.payload }
    default:
      return state
  }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

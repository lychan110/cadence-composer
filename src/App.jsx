import { AppProvider, useApp } from './AppContext.jsx'
import BlockComposer from './components/BlockComposer.jsx'
import TagRegistry from './components/TagRegistry.jsx'
import ImagePool from './components/ImagePool.jsx'
import CsvMapper from './components/CsvMapper.jsx'
import Preview from './components/Preview.jsx'
import Toolbar from './components/Toolbar.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

function App() {
  return (
    <AppProvider>
      <main style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <section>
          <ErrorBoundary>
            <Toolbar />
          </ErrorBoundary>
          <ErrorBoundary>
            <BlockComposer />
          </ErrorBoundary>
          <ErrorBoundary>
            <TagRegistry />
          </ErrorBoundary>
          <ErrorBoundary>
            <ImagePool />
          </ErrorBoundary>
          <ErrorBoundary>
            <CsvMapper />
          </ErrorBoundary>
        </section>
        <section>
          <ErrorBoundary>
            <Preview />
          </ErrorBoundary>
        </section>
      </main>
    </AppProvider>
  )
}

export default App
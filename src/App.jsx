import { AppProvider, useApp } from './AppContext.jsx'
import BlockComposer from './components/BlockComposer.jsx'
import TagRegistry from './components/TagRegistry.jsx'
import ImagePool from './components/ImagePool.jsx'
import CsvMapper from './components/CsvMapper.jsx'
import Preview from './components/Preview.jsx'
import Toolbar from './components/Toolbar.jsx'

function App() {
  return (
    <AppProvider>
      <main style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <section>
          <Toolbar />
          <BlockComposer />
          <TagRegistry />
          <ImagePool />
          <CsvMapper />
        </section>
        <section>
          <Preview />
        </section>
      </main>
    </AppProvider>
  )
}

export default App

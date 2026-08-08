import { useState } from 'react'
import { AppProvider } from './AppContext.jsx'
import BlockComposer from './components/BlockComposer.jsx'
import TagRegistry from './components/TagRegistry.jsx'
import ImagePool from './components/ImagePool.jsx'
import CsvMapper from './components/CsvMapper.jsx'
import Preview from './components/Preview.jsx'
import Toolbar from './components/Toolbar.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

function App() {
  const [activePane, setActivePane] = useState('edit')

  return (
    <AppProvider>
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="app-shell">
        <header className="app-header no-print">
          <span className="app-header-eyebrow">CADENCE</span>
          <h1 className="app-header-title">Template Composer</h1>
          <div className="app-header-right">
            <div className="tab-switcher" role="tablist" aria-label="Composer view">
              <button
                className={`tab-option${activePane === 'edit' ? ' active' : ''}`}
                onClick={() => setActivePane('edit')}
                role="tab"
                aria-selected={activePane === 'edit'}
                aria-controls="pane-edit"
                id="tab-edit"
              >Edit</button>
              <button
                className={`tab-option${activePane === 'preview' ? ' active' : ''}`}
                onClick={() => setActivePane('preview')}
                role="tab"
                aria-selected={activePane === 'preview'}
                aria-controls="pane-preview"
                id="tab-preview"
              >Preview</button>
            </div>
          </div>
        </header>

        <ErrorBoundary>
          <div className="content-split" id="main">
            <div
              className={`pane editor-pane${activePane === 'edit' ? ' visible-mobile' : ' hidden-mobile'}`}
              role="tabpanel"
              id="pane-edit"
              aria-labelledby="tab-edit"
            >
              <Toolbar />
              <div className="section-eyebrow">BLOCKS</div>
              <BlockComposer />
              <div className="section-eyebrow">TAGS</div>
              <TagRegistry />
              <div className="section-eyebrow">IMAGES</div>
              <ImagePool />
              <div className="section-eyebrow">CSV DATA</div>
              <CsvMapper />
            </div>
            <div
              className={`pane preview-pane${activePane === 'preview' ? ' visible-mobile' : ' hidden-mobile'}`}
              role="tabpanel"
              id="pane-preview"
              aria-labelledby="tab-preview"
            >
              <div className="section-eyebrow">PREVIEW</div>
              <Preview />
            </div>
          </div>
        </ErrorBoundary>
      </div>
    </AppProvider>
  )
}

export default App

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
          <span className="app-header-title">Template Composer</span>
          <div className="app-header-right">
            <div className="tab-switcher">
              <button
                className={`tab-option${activePane === 'edit' ? ' active' : ''}`}
                onClick={() => setActivePane('edit')}
              >Edit</button>
              <button
                className={`tab-option${activePane === 'preview' ? ' active' : ''}`}
                onClick={() => setActivePane('preview')}
              >Preview</button>
            </div>
          </div>
        </header>

        <div className="content-split" id="main">
          <div className={`pane editor-pane${activePane === 'edit' ? ' visible-mobile' : ' hidden-mobile'}`}>
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
          <div className={`pane preview-pane${activePane === 'preview' ? ' visible-mobile' : ' hidden-mobile'}`}>
            <div className="section-eyebrow">PREVIEW</div>
            <Preview />
          </div>
        </div>
      </div>
    </AppProvider>
  )
}

export default App

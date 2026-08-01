import { Component } from 'react'

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="section error-boundary">
          <p className="error-text">{this.state.error?.message || this.state.error?.toString() || 'Unknown error'}</p>
          {this.state.error?.stack && (
            <pre className="muted-text" style={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}>
              {this.state.error.stack}
            </pre>
          )}
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
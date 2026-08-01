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
        <pre style={{ color: 'red', padding: '1rem', whiteSpace: 'pre-wrap' }}>
          {this.state.error?.message || this.state.error?.toString() || 'Unknown error'}
          {'\n\n'}
          {this.state.error?.stack || ''}
        </pre>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
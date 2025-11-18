 import React from 'react'
import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorCount: 0 
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }))

    // Log to error reporting service (e.g., Sentry)
    if (window.Sentry) {
      window.Sentry.captureException(error, { extra: errorInfo })
    }
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg px-4">
          <div className="max-w-2xl w-full">
            {/* Error Icon */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
                <FaExclamationTriangle className="text-5xl text-red-500" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                We're sorry for the inconvenience. The application encountered an unexpected error.
              </p>
            </div>

            {/* Error Card */}
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-6 mb-6">
              {/* User-friendly message */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">What can you do?</h2>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Try refreshing the page</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Go back to the home page</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Clear your browser cache and cookies</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Contact support if the problem persists</span>
                  </li>
                </ul>
              </div>

              {/* Developer Details (only in dev mode) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-4">
                  <summary className="cursor-pointer font-semibold text-red-600 mb-2 hover:text-red-700">
                    🔧 Error Details (Development Mode)
                  </summary>
                  <div className="bg-gray-100 dark:bg-dark-bg p-4 rounded-lg overflow-auto">
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Error Message:
                      </p>
                      <pre className="text-xs text-red-600 whitespace-pre-wrap">
                        {this.state.error.toString()}
                      </pre>
                    </div>
                    
                    {this.state.errorInfo && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          Component Stack:
                        </p>
                        <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap max-h-64 overflow-auto">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}

                    {this.state.errorCount > 1 && (
                      <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded">
                        <p className="text-sm text-yellow-800 dark:text-yellow-400">
                          ⚠️ This error has occurred {this.state.errorCount} times
                        </p>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition"
                >
                  <FaRedo />
                  <span>Refresh Page</span>
                </button>
                
                <button
                  onClick={this.handleReset}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gray-200 hover:bg-gray-300 dark:bg-dark-bg dark:hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition"
                >
                  <span>Try Again</span>
                </button>
                
                <button
                  onClick={() => window.location.href = '/'}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gray-200 hover:bg-gray-300 dark:bg-dark-bg dark:hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition"
                >
                  <FaHome />
                  <span>Go Home</span>
                </button>
              </div>
            </div>

            {/* Support Info */}
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              <p>
                Need help? Contact us at{' '}
                <a href="mailto:support@garmentexport.com" className="text-primary-600 hover:text-primary-700">
                  support@garmentexport.com
                </a>
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

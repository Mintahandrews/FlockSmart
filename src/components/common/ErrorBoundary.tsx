import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Bug, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 bg-red-50 rounded-lg shadow-md">
          <Bug size={48} className="text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-red-600 mb-2">Something went wrong</h2>
          <p className="text-gray-700 mb-4">The application encountered an unexpected error.</p>
          <details className="bg-white p-4 rounded-md w-full max-w-2xl">
            <summary className="font-medium cursor-pointer mb-2">Error details</summary>
            <p className="text-sm font-mono whitespace-pre-wrap bg-gray-100 p-3 rounded">
              {this.state.error?.toString()}
            </p>
            {this.state.errorInfo && (
              <p className="text-sm font-mono whitespace-pre-wrap bg-gray-100 p-3 rounded mt-2">
                {this.state.errorInfo.componentStack}
              </p>
            )}
          </details>
          <button
            onClick={this.handleReload}
            className="mt-6 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

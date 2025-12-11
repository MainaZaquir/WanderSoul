import React, { Component, ErrorInfo, ReactNode } from 'react';
import { TriangleAlert as AlertTriangle, RefreshCw, Hop as Home } from 'lucide-react';
import { logError } from '../lib/errorLogger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // Log error to our error logging service
    logError(error, {
      errorType: 'React Error Boundary',
      stackTrace: errorInfo.componentStack,
    });
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 p-4 rounded-full">
                <AlertTriangle className="text-red-600" size={32} />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Oops! Something went wrong
            </h1>
            
            <p className="text-gray-600 mb-8">
              We're sorry, but something unexpected happened. Our team has been notified and is working on a fix.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={this.handleRefresh}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                <RefreshCw size={16} />
                <span>Try Again</span>
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="btn-outline w-full flex items-center justify-center space-x-2"
              >
                <Home size={16} />
                <span>Go Home</span>
              </button>
            </div>
            
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Error Details (Development)
                </summary>
                <pre className="mt-4 p-4 bg-gray-100 rounded-lg text-xs overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
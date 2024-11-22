import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-green-500 flex items-center justify-center p-4">
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-8 max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4 matrix-glow">A Glitch in the Matrix</h2>
            <p className="mb-4">The system has encountered an anomaly.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-green-500/20 hover:bg-green-500/30 text-green-500 px-4 py-2 rounded transition-colors"
            >
              Reload the Matrix
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
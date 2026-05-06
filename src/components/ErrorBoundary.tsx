"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="bg-card rounded-xl p-6 text-center m-4">
            <div className="text-2xl mb-2">⚠️</div>
            <h3 className="text-sm font-bold mb-1">Something went wrong</h3>
            <p className="text-xs text-zinc-500 mb-3">{this.state.error?.message}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="btn-secondary px-4 py-1.5 rounded-lg text-xs"
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

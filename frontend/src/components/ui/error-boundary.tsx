import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertTitle } from '@mui/material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Alert severity="error" sx={{ mt: 2 }}>
          <AlertTitle>Something went wrong</AlertTitle>
          {this.state.error?.message || 'An unexpected error occurred'}
        </Alert>
      );
    }

    return this.props.children;
  }
} 
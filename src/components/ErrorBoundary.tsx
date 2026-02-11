/**
 * ErrorBoundary — graceful error handling for the flowcharting panel
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { css } from '@emotion/css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class FlowchartErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[Flowcharting] Panel error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={styles.container}>
          <h3 className={styles.title}>Flowchart Rendering Error</h3>
          <p className={styles.message}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          {this.state.errorInfo && (
            <details className={styles.details}>
              <summary>Error Details</summary>
              <pre className={styles.stack}>
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          <button
            className={styles.button}
            onClick={() => this.setState({ hasError: false })}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 40px 20px;
    text-align: center;
  `,
  title: css`
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 10px;
    color: #f2495c;
  `,
  message: css`
    font-size: 14px;
    color: #999;
    margin-bottom: 20px;
    max-width: 500px;
  `,
  details: css`
    margin-top: 20px;
    text-align: left;
    summary {
      cursor: pointer;
      font-size: 12px;
      color: #666;
      margin-bottom: 10px;
    }
  `,
  stack: css`
    font-size: 11px;
    font-family: monospace;
    background: #f5f5f5;
    padding: 10px;
    border-radius: 4px;
    overflow-x: auto;
    max-width: 600px;
    color: #333;
  `,
  button: css`
    padding: 8px 16px;
    background: #1f77b4;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    &:hover {
      background: #1a5f8f;
    }
  `,
};

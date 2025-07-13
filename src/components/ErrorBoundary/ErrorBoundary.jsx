import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error
    console.error("Error caught by boundary:", error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h2>🚨 Something went wrong</h2>
            <p>We're sorry, but something unexpected happened.</p>

            <div className="error-actions">
              <button
                onClick={() => window.location.reload()}
                className="error-reload-btn"
              >
                🔄 Reload Page
              </button>

              <button
                onClick={() =>
                  this.setState({
                    hasError: false,
                    error: null,
                    errorInfo: null,
                  })
                }
                className="error-retry-btn"
              >
                🔁 Try Again
              </button>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="error-details">
                <summary>Error Details (Development Only)</summary>
                <div className="error-stack">
                  <h4>Error:</h4>
                  <pre>{this.state.error.toString()}</pre>

                  <h4>Stack Trace:</h4>
                  <pre>{this.state.errorInfo.componentStack}</pre>
                </div>
              </details>
            )}
          </div>

          <style jsx>{`
            .error-boundary {
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 50vh;
              padding: 20px;
              background: linear-gradient(135deg, #ff6b6b, #ee5a52);
              color: white;
              text-align: center;
            }

            .error-boundary-content {
              background: rgba(255, 255, 255, 0.1);
              padding: 40px;
              border-radius: 12px;
              max-width: 500px;
              width: 100%;
              backdrop-filter: blur(10px);
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            }

            .error-boundary h2 {
              margin: 0 0 16px 0;
              font-size: 24px;
              font-weight: 700;
            }

            .error-boundary p {
              margin: 0 0 24px 0;
              opacity: 0.9;
              line-height: 1.5;
            }

            .error-actions {
              display: flex;
              gap: 12px;
              justify-content: center;
              margin-bottom: 20px;
            }

            .error-reload-btn,
            .error-retry-btn {
              background: rgba(255, 255, 255, 0.2);
              color: white;
              border: 2px solid rgba(255, 255, 255, 0.3);
              padding: 10px 20px;
              border-radius: 8px;
              cursor: pointer;
              font-weight: 600;
              transition: all 0.3s ease;
            }

            .error-reload-btn:hover,
            .error-retry-btn:hover {
              background: rgba(255, 255, 255, 0.3);
              border-color: rgba(255, 255, 255, 0.5);
            }

            .error-details {
              background: rgba(0, 0, 0, 0.2);
              border-radius: 8px;
              padding: 16px;
              text-align: left;
              margin-top: 20px;
            }

            .error-details summary {
              cursor: pointer;
              font-weight: 600;
              margin-bottom: 12px;
            }

            .error-stack {
              font-size: 12px;
              line-height: 1.4;
            }

            .error-stack h4 {
              margin: 12px 0 8px 0;
              font-size: 14px;
            }

            .error-stack pre {
              background: rgba(0, 0, 0, 0.3);
              padding: 8px;
              border-radius: 4px;
              overflow-x: auto;
              white-space: pre-wrap;
              word-break: break-word;
            }

            @media (max-width: 768px) {
              .error-actions {
                flex-direction: column;
              }
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h2>Algo deu errado.</h2>
          <p>Ocorreu um erro inesperado. Tente recarregar a página.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1.5rem",
              cursor: "pointer",
            }}
          >
            Recarregar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

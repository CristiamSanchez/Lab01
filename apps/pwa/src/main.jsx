import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('📱 [PWA ErrorBoundary] Error capturado:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: '#faf8f5',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🍔</div>
          <h2 style={{ color: '#b45309', marginBottom: '8px', fontSize: '1.4rem' }}>Hamburger Rapid App</h2>
          <p style={{ color: '#78350f', maxWidth: '340px', fontSize: '0.85rem', marginBottom: '20px', lineHeight: '1.4' }}>
            Hubo un problema temporal al cargar la aplicación. Presiona el botón para actualizar y limpiar la caché local.
          </p>
          <button
            onClick={() => {
              if ('caches' in window) {
                caches.keys().then(names => Promise.all(names.map(n => caches.delete(n))));
              }
              window.location.reload();
            }}
            style={{
              background: 'linear-gradient(135deg, #d97706, #ea580c)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(217,119,6,0.3)'
            }}
          >
            🔄 Recargar y Limpiar Caché
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

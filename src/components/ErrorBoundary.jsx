import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[National Duty] Crash:', error, info?.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0f1a',
          color: '#f8fafc',
          padding: '24px',
          gap: '20px',
          fontFamily: 'Outfit, system-ui, sans-serif',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '64px' }}>⚽</div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>
            Bir şeyler ters gitti
          </h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0, maxWidth: '280px' }}>
            {this.state.error?.message || 'Beklenmedik bir hata oluştu.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 28px',
              background: 'rgba(16,185,129,0.15)',
              border: '1px solid rgba(16,185,129,0.4)',
              color: '#6ee7b7',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            🔄 Yeniden Başlat
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
